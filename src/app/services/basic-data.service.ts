import {Injectable} from '@angular/core';
import {HttpClientService} from './http-client.service';
import {Observable} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {map} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class BasicDataService {


  constructor(
    private http: HttpClientService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
  }

  getData(path, key): Observable<any[]> {
    return new Observable(observer => {
      this.getDataFromServer(path, key).subscribe(
        data => {
          observer.next(data);
          observer.complete();
        },
        error => {
          if (error && error.statusText === 'Not Found') {
            observer.next([]);
            observer.complete();
          } else {
            observer.next([]);
            observer.complete();
          }
        }
      );
    });
  }

  getDetailedListUsingSqlView(path: string) {
    return this.http.get('sqlViews/sCMb59O9MVl/data?paging=false&filter=namespace:eq:' + path)
      .pipe(
        map(i => i.listGrid),
        map(i => i.rows),
        map(i => i.map(k => k[2] ? JSON.parse(k[2].value) : {}))
      );
  }


  getDataFromServer(path, key): Observable<any[]> {
    return new Observable(observer => {
      this.http.get(`dataStore/${path}/${key}`).subscribe(
        data => {
          observer.next(data);
          observer.complete();
        },
        error => {
          if (error.statusText === 'Not Found') {
            observer.next([]);
            observer.complete();
          } else {
            observer.error();
          }
        }
      );
    });
  }

  getDataServer(path): Observable<any[]> {
    return new Observable(observer => {
      this.http.get(`dataStore/${path}`).subscribe(
        data => {
          observer.next(data);
          observer.complete();
        },
        error => {
          if (error.status === 404) {
            observer.next([]);
            observer.complete();
          } else {
            observer.error();
          }
        }
      );
    });
  }

  /**
   * This method will help to save new data or update existing data to data store
   * @param path
   * @param key
   * @param data
   */
  saveToDataStore(path, key, data) {
    return new Observable(observer => {
      // try to update the dataStore first
      this.http.put(`dataStore/${path}/${key}`, data).subscribe(
        result => {
          observer.next(result);
          observer.complete();
        },
        error => {
          // if there is an error and the error is that the key does not exist then create it
          if (error.message.indexOf('was not found in the namespace') > -1) {
            this.http.post(`dataStore/${path}/${key}`, data).subscribe(
              result => {
                observer.next(result);
                observer.complete();
              },
              error1 => observer.error(error1)
            );
          }
        }
      );
    });
  }

  public print(printEl: HTMLElement, title) {
    const mywindow = window.open('', 'PRINT', '');
    const style =
      '<html lang="en"> ' +
      '<head>' +
        '<meta charset="utf-8"/>' +
        '<base href=""/>' +
        '<meta name="viewport" content="width=device-width, initial-scale=1"/>' +
        '<link rel="icon" type="image/x-icon" href="favicon.ico"/>' +
        '<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&amp;display=swap" rel="stylesheet"/>' +
      '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
      '<style>' +
      'table {\n' +
      '    width:100%;' +
      '    margin-bottom:20px\n' +
      '}\n' +
      'table.table {\n' +
      '    border:solid #000 !important;\n' +
      '    border-width:1px 0 0 1px !important;\n' +
      '}\n' +
      print +
      '.table th, .table td {\n' +
      '    border:solid #000 !important;\n' +
      '    border-width:0 1px 1px 0 !important;\n' +
      '}' +
      '</style>' + '</head>' + '</html>';
    mywindow.document.write(style + printEl.innerHTML);

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    setTimeout(() => {
      mywindow.print();
      mywindow.close();
    });
  }

  /**
   * This function helps to delete data from dataStore
   * @param path
   * @param key
   */
  deleteData(path, key) {
    return new Observable(observer => {
      this.http.delete(`dataStore/${path}/${key}`).subscribe(
        data => {
          observer.next(data);
          observer.complete();
        },
        error1 => observer.error(error1)
      );
    });
  }

  /**
   * This function is used to update the list of data in a single key of data store
   * It will first fetch data from data store to obtain the current list
   * Then it will replace the item that has been provided if found or add it at the start of the list if not found
   * @param sourceItems
   * @param item
   * @param namespace
   * @param key
   */
  async addItemInArray1(
    item: any,
    namespace: string,
    key: string
  ): Promise<string> {
    try {
      const sourceItems = await this.getData(namespace, key).toPromise();
      const items = [...sourceItems];
      const index = items.findIndex(i => i.id === item.id);
      if (index > -1) {
        items[index] = item;
      } else {
        items.push(item);
      }
      await this.saveToDataStore(namespace, key, items).toPromise();
      return 'Success';
    } catch (e) {
      return e;
    }
  }

  addItemInArray(
    sourceItems: any[],
    item: any,
    path: string,
    key: string
  ): Observable<string> {
    const items = [...sourceItems];
    return new Observable(observer => {
      const index = items.findIndex(i => i.id === item.id);
      if (index > -1) {
        items[index] = item;
      } else {
        items.push(item);
      }
      this.saveToDataStore(path, key, items).subscribe(
        data => {
          observer.next('Success');
          observer.complete();
        },
        error1 => observer.error()
      );
    });
  }

  addItemsInArray(
    items: any[],
    new_items: any[],
    path: string,
    key: string
  ): Observable<any> {
    return new Observable(observer => {
      const itemsToPush = [...items, ...new_items];
      this.saveToDataStore(path, key, itemsToPush).subscribe(
        data => {
          observer.next('Success');
          observer.complete();
        },
        error1 => observer.error()
      );
    });
  }

  removeItemInArray(itemId: any, path: string, key: string): Observable<any> {
    return new Observable(observer => {
      this.getData(path, key).subscribe(
        (onlineData: any) => {
          const items = onlineData.filter(item => item.id !== itemId);
          this.saveToDataStore(path, key, items).subscribe(
            data => {
              observer.next('Success');
              observer.complete();
            },
            error1 => observer.error()
          );
        },
        error1 => observer.error()
      );
    });
  }

  showSuccess(message: string = 'Success') {
    this.snackBar.open(message, 'Ok', {
      duration: 2500,
      panelClass: 'success'
    });
  }

  showError(message: string = 'Operation Failed', duration: number = 2500) {
    this.snackBar.open(message, 'Ok', {duration, panelClass: 'error'});
  }

  showWarning(message: string = 'Something went wrong', duration: number = 2500) {
    this.snackBar.open(message, 'Ok', {duration, panelClass: 'warning'});
  }

}
