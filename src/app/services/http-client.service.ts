import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ManifestService } from './manifest.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HttpClientService {
  constructor(
    private httpClient: HttpClient,
    private manifestService: ManifestService
  ) {}

  createDHISAuthorizationHeader(token) {
    const headers = new HttpHeaders({ Authorization: 'Basic ' + token });
    return headers;
  }

  get(
    url: string,
    useRootUrl: boolean = true
  ): Observable<any> {
    const rootUrlPromise = useRootUrl
      ? this.manifestService.getRootUrl()
      : this._getApiRootUrl();
    const token = localStorage.getItem('current-user-token');
    const headers: HttpHeaders = this.createDHISAuthorizationHeader(token);

    return rootUrlPromise.pipe(
      mergeMap((rootUrl) => {
        return this.httpClient
          .get(rootUrl + url, { headers })
          .pipe(catchError(this._handleError));
      }),
      catchError(this._handleError)
    );
  }

  getImage(
    url: string,
    useRootUrl: boolean = true
  ): Observable<any> {
    const rootUrlPromise = useRootUrl
      ? this.manifestService.getRootUrl()
      : this._getApiRootUrl();
    const token = localStorage.getItem('current-user-token');
    const headers: HttpHeaders = this.createDHISAuthorizationHeader(token);

    return rootUrlPromise.pipe(
      mergeMap((rootUrl) => {
        return this.httpClient
          .get(rootUrl + url, { headers, responseType: 'arraybuffer' })
          .pipe(catchError(this._handleError));
      }),
      catchError(this._handleError)
    );
  }
  post(
    url: string,
    data: any,
    useRootUrl: boolean = true,
  ) {
    const rootUrlPromise = useRootUrl
      ? this.manifestService.getRootUrl()
      : this._getApiRootUrl();
    const token = localStorage.getItem('current-user-token');
    const headers: HttpHeaders = this.createDHISAuthorizationHeader(token);
    return rootUrlPromise.pipe(
      mergeMap((rootUrl) =>
        this.httpClient
          .post(rootUrl + url, data, { headers })
          .pipe(catchError(this._handleError))
      ),
      catchError(this._handleError)
    );
  }

  put(
    url: string,
    data: any,
    useRootUrl: boolean = true
  ) {
    const rootUrlPromise = useRootUrl
      ? this.manifestService.getRootUrl()
      : this._getApiRootUrl();
    const token = localStorage.getItem('current-user-token');
    const headers: HttpHeaders = this.createDHISAuthorizationHeader(token);
    return rootUrlPromise.pipe(
      mergeMap((rootUrl) =>
        this.httpClient
          .put(rootUrl + url, data, { headers })
          .pipe(catchError(this._handleError))
      ),
      catchError(this._handleError)
    );
  }

  delete(
    url: string,
    useRootUrl: boolean = true
  ) {
    const rootUrlPromise = useRootUrl
      ? this.manifestService.getRootUrl()
      : this._getApiRootUrl();
    const token = localStorage.getItem('current-user-token');
    const headers: HttpHeaders = this.createDHISAuthorizationHeader(token);
    return rootUrlPromise.pipe(
      mergeMap((rootUrl) =>
        this.httpClient
          .delete(rootUrl + url, { headers })
          .pipe(catchError(this._handleError))
      ),
      catchError(this._handleError)
    );
  }
  
  private _handleError(err: HttpErrorResponse) {
    let error = null;
    if (err.error instanceof ErrorEvent) {
      error = {
        message: err.error,
        status: err.status,
        statusText: err.statusText,
      };
    } else {
      error = {
        message:
          err.error instanceof Object
            ? err.error.message
            : err.error || err.message,
        status: err.status,
        statusText: err.statusText,
      };
    }
    return throwError(error);
  }

  private _getApiRootUrl(
  ) {
    return of(`/api/`);
  }
}
