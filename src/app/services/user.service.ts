import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../store/user/user.model';
import { HttpClientService } from './http-client.service';
import {
  shareReplay,
} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ManifestService } from './manifest.service';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';

let authenticationtoken;

export class AddHeaderInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('current-user-token');
    if (token) {
      return next.handle(
        req.clone({
          headers: req.headers.set('Authorization', 'Basic ' + token)
        })
      );
    }
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', 'Basic ' + authenticationtoken)
    });
    return next.handle(clonedRequest);
  }
}

@Injectable({ providedIn: 'root' })
export class UserService {
  userGroups;
  user$;

  constructor(
    private httpClient: HttpClientService,
    private http: HttpClient,
    private manifestService: ManifestService,
  ) {
    this.user$ = this.loadCurrentUser().pipe(shareReplay(1));
  }

  /**
   * Load current user information
   * @returns {Observable<User>}
   */
  loadCurrentUser(): Observable<User> {
    return new Observable(observer => {
      this.httpClient
        .get(
          `me.json?fields=id,name,displayName,created,lastUpdated,email,phoneNumber,userGroups[id,name],
  dataViewOrganisationUnits[id,name,level,parent[id,name]],organisationUnits[id,name,level,parent[id,name]],userCredentials[username,userRoles[authorities]],attributeValues[value,attribute[id,shortName]]`
        )
        .subscribe(
          user => {
            localStorage.setItem('tulonge-user-object', JSON.stringify(user));
            observer.next(user);
            observer.complete();
          },
          error1 => observer.error()
        );
    });
  }

  login(credentials: { username; password }): Observable<string> {
    const meUrl =
      'me.json?fields=id,name,displayName,created,lastUpdated,email,phoneNumber,userGroups[id,name],dataViewOrganisationUnits[id,name,level,parent[id,name]],organisationUnits[id,name,level,parent[id,name]],userCredentials[username,userRoles[authorities]],attributeValues[value,attribute[id,shortName]]';
    return new Observable(observer => {
      const token = this.prepareToken(credentials);
      authenticationtoken = token;
      this.removeLocalStorageItem('current-user-token');
      const headers: HttpHeaders = this.createDHISAuthorizationHeader(token);
      this.manifestService.getRootUrl().subscribe(rootUrl => {
        this.http.get(rootUrl + meUrl, { headers }).subscribe(
          (data: User) => {
            localStorage.setItem('current-user-token', token);
            observer.next('Login successful..');
            observer.complete();
          },
          error1 => {
            const errorMessage = error1.message;
            if (errorMessage.indexOf('Unauthorized')) {
              observer.error('Incorrect Username or Password');
            } else if (errorMessage.indexOf('unknown url')) {
              observer.error('There is no internet connection');
            } else {
              observer.error(
                'There is problem with server please contact the administrator'
              );
            }
          }
        );
      });
    });
  }

  removeLocalStorageItem(key) {
    localStorage.removeItem(`${key}`);
  }

  prepareToken(credentials: { username; password }) {
    const username = credentials.username;
    const password = credentials.password;
    const token = btoa(username + ':' + password);
    return token;
  }

  createDHISAuthorizationHeader(token) {
    const headers = new HttpHeaders({ Authorization: 'Basic ' + token });
    return headers;
  }

  getCurrentUser() {
    return this.user$;
  }

  getRoles(): Observable<any> {
    return new Observable(observer => {
      this.httpClient.get('userRoles.json?fields=id,name&paging=false').subscribe((success) => {
        observer.next(success.userRoles);
        observer.complete();
      }, (error) => {
        observer.error();
      });
    });

  }

  getUsers(filter?): Observable<User[]> {
    return new Observable(observer => {
      let users = [];
      let url = `users.json?fields=id,name,firstName,phoneNumber,email,gender,surname,dataViewOrganisationUnits[id],
      organisationUnits[id],userCredentials[id,username,userRoles[id,authorities]],
      attributeValues[value,attribute[id,shortName]&paging=false`;
      if (filter) {
        url = url + filter;
      }

      this.httpClient
        .get(url)
        .subscribe(userData => {
          users = userData.users.map(user => {
            return {
              ...user,
              username: user.userCredentials.username
            };
          });
          observer.next(users);
          observer.complete();
        }, (error) => {
          observer.error(error);
        });
    });
  }

  addDHISUser(user): Observable<any> {
    return new Observable(observer => {
      this.httpClient.post('users', user).subscribe((success: any) => {
        if (success.status !== 'ERROR') {
          observer.next(success);
          observer.complete();
        } else {
          this.httpClient.put('users/' + user.id, user).subscribe((putSuccess: any) => {
            observer.next(putSuccess);
            observer.complete();
          }, (putError) => {
            observer.error(putError);
          });
        }
      }, (error) => {

      });
    });
  }

}
