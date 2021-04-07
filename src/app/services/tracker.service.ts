import {Injectable} from '@angular/core';
import {HttpClientService} from './http-client.service';
import {Observable, throwError} from 'rxjs';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store';
// import {LocalStorageService} from './localStorageService';
import {TrackedEntityTypes} from '../store/metadata-mapping/programs';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrackerService {
  constructor(
    private http: HttpClientService,
    private store: Store<ApplicationState>,
    // private localDbService: LocalStorageService
  ) {
  }

  // generate a random list of Id for use as scorecard id
  // 11 characters long.
  // Alphanumeric characters only, ie. alphabetic or numeric characters (A-Za-z0-9).
  // Start with an alphabetic character (A-Za-z).
  makeid(): string {
    let text = '';
    const possible_combinations = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const first_possible_combinations = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 11; i++) {
      const charPosition = i === 0 ? Math.random() * first_possible_combinations.length : Math.random() * possible_combinations.length;
      text += possible_combinations.charAt(Math.floor(charPosition));
    }
    return text;
  }

  // save tracked entity
  saveTrackedEntity(trackedEntity) {
    return this.http.post(`30/trackedEntityInstances`, trackedEntity);
  }

  // save events
  saveEvent(event) {
    return this.http.post(`events`, event);
  }

  updateEvent(event, eventId) {
    return this.http.put(`events/${eventId}`, event);
  }

  deleteEvent(eventId) {
    return this.http.delete(`events/${eventId}`);
  }

  // update tracked entity
  updateTrackedEntity(trackedEntity, trackedEntityInstanceId) {
    return this.http.put(
      `30/trackedEntityInstances/${trackedEntityInstanceId}`,
      trackedEntity
    );
  }

  // cancel tracked entity
  cancelTrackedEntity(trackedEntity, trackedEntityInstanceId) {
    return this.http.put(
      `30/trackedEntityInstances/${trackedEntityInstanceId}`,
      trackedEntity
    );
  }

  // get enrollments tracked entity
  getEnrollments(trackedEntityId, ouId) {
    return this.http.get(
      `30/enrollments.json?ou=${ouId}&ouMode=SELECTED&trackedEntity=${trackedEntityId}`
    );
  }

  // delete tracked entity
  deleteTrackedEntity(trackedEntityInstanceId: string) {
    return this.http.delete(
      `30/trackedEntityInstances/${trackedEntityInstanceId}`);
  }

  getEvent(eventId, key, stageKey): Observable<any> {
    return Observable.create(observer => {
      const metadata = TrackedEntityTypes[key];
      if (!metadata) {
        observer.next(null);
        observer.complete();
      } else {
        const eventUrl = `events/${eventId}.json`;
        const stage = metadata.stage[stageKey];
        const eventsRequest = this.http.get(eventUrl);
        eventsRequest.subscribe(
          (event: any) => {
            const dataObject = {};
            dataObject['id'] = event.event;
            dataObject['organisation_unit_id'] = event.orgUnit;
            dataObject['trackedEntityInstance'] = event.trackedEntityInstance;
            dataObject['enrollment'] = event.enrollment;
            dataObject['created'] = event.eventDate;
            dataObject['last_update'] = event.lastUpdated;
            dataObject['programStage'] = event.programStage;
            dataObject['storedBy'] = event.storedBy;
            stage.dataElements.forEach(element => {
              const attribute_name = this._getAttributeKeyId(
                stage.dataElements,
                element.key
              );
              const dataElement = event.dataValues.find(item => item.dataElement === attribute_name);
              if (dataElement) {
                dataObject[element.key] = dataElement['value'];
              }
            });
            observer.next(dataObject);
            observer.complete();
          }, error1 => observer.error(error1));
      }
    });
  }

  getEvents(key, ou, stageKey, ouMode = 'SELECTED', filter = '', startDate = null, endDate = null, dateType = 'program', pageSize = 400): Observable<any> {
    return Observable.create(observer => {
      const metadata = TrackedEntityTypes[key];
      if (!metadata) {
        observer.next([]);
        observer.complete();
      } else {
        const stage = metadata.stage[stageKey];
        let eventUrl = `events.json?programStage=${stage.id}&orgUnit=${ou}&ouMode=${ouMode}&pageSize=${pageSize}${filter}`;
        if (startDate) {
          if (dateType === 'program') {
            eventUrl += `&startDate=${startDate}&endDate=${endDate}`;
          } else {
            eventUrl += `&lastUpdatedStartDate=${startDate}&lastUpdatedEndDate=${endDate}`;
          }
        }
        const eventsRequest = this.http.get(eventUrl);
        eventsRequest.subscribe(
          (result: any) => {
            const retunItem = this.mapEventToObject(key, stageKey, result.events);
            observer.next(retunItem);
            observer.complete();
          },
          error => observer.error()
        );
      }
    });
  }

  prepareTrackedEntityFilterString(
    key,
    filters: { attribute_key: string; value: any; filter_string?: string }[]
  ): string {
    let filterString = '';
    const metadata = TrackedEntityTypes[key];
    if (metadata) {
      filterString = filters
        .map(filter => {
          const filterId = this._getAttributeKeyId(
            metadata.attributes,
            filter.attribute_key
          );
          const str = filter.filter_string ? filter.filter_string : 'eq';
          return filterId ? `filter=${filterId}:${str}:${filter.value}` : '';
        })
        .filter(item => item !== '')
        .join('&');
    }
    return filterString === '' ? '' : `&${filterString}`;
  }

  prepareTrackedEntityFilterStringParam(
    key,
    filters: { attribute_key: string; value: any }[]
  ): string {
    let filterString = '';
    const metadata = TrackedEntityTypes[key];
    if (metadata) {
      filterString = filters
        .map(filter => {
          const filterId = this._getAttributeKeyId(
            metadata.attributes,
            filter.attribute_key
          );
          return filterId ? `filter=${filterId}:eq:${filter.value}` : '';
        })
        .filter(item => item !== '')
        .join('&');
    }
    return filterString === '' ? '' : `&${filterString}`;
  }

  prepareEventEntityFilterString(
    programKey,
    stageKey,
    filters: { attribute_key: string; value: any }[]
  ): string {
    let filterString = '';
    const metadata = TrackedEntityTypes[programKey];
    if (metadata) {
      const stage = metadata.stage[stageKey];
      if (stage) {
        filterString = filters
          .map(filter => {
            const filterId = this._getAttributeKeyId(
              stage.dataElements,
              filter.attribute_key
            );
            return filterId ? `filter=${filterId}:eq:${filter.value}` : '';
          })
          .filter(item => item !== '')
          .join('&');
      }
    }
    return filterString === '' ? '' : `&${filterString}`;
  }

  getTrackedEntityInstance(key, ou, ouMode = 'SELECTED', filter = '', startDate = null, endDate = null, dateType = 'program', pageSize = 400): Observable<any> {
    return new Observable(observer => {
      const metadata = TrackedEntityTypes[key];
      if (!metadata) {
        observer.next([]);
        observer.complete();
      } else {
        const fieldFilters = '&fields=created,orgUnit,trackedEntityInstance,lastUpdated,enrollments[storedBy,enrollmentDate],attributes[storedBy,value,attribute]';
        let eventUrl = `trackedEntityInstances.json?ou=${ou}&ouMode=${ouMode}&program=${metadata.program}&pageSize=${pageSize}${filter}${fieldFilters}`;
        if (startDate) {
          if (dateType === 'program') {
            eventUrl += `&programStartDate=${startDate}&programEndDate=${endDate}`;
          } else {
            eventUrl += `&lastUpdatedStartDate=${startDate}&lastUpdatedEndDate=${endDate}`;
          }
        }
        this.http.get(eventUrl).subscribe(
          (data) => {
            const returnObject = data.trackedEntityInstances.map(resultRow => {
              const dataObject: any = {};
              dataObject['id'] = resultRow['trackedEntityInstance'];
              metadata.attributes.forEach((attribute: any) => {
                const attribute_name = this._getAttributeKeyId(
                  metadata.attributes,
                  attribute.key
                );
                const dataElement = resultRow.attributes.find(item => item.attribute === attribute_name);
                if (dataElement) {
                  dataObject[attribute.key] = dataElement['value'];
                }
              });
              const enrollmentItem: any = resultRow['enrollments'][0];
              const enrollment_id: string = enrollmentItem
                ? enrollmentItem.enrollment
                : '';
              const enrollment_date: string = enrollmentItem
                ? enrollmentItem.enrollmentDate
                : '';
              const storedBy: string = enrollmentItem
                ? enrollmentItem.storedBy
                : '';
              return {
                ...dataObject,
                enrollment_id: enrollment_id,
                organisation_unit_id: resultRow['orgUnit'],
                last_updated: resultRow['created'],
                created: enrollment_date,
                inactive: resultRow['inactive'],
                storedBy
              };
            });
            observer.next(returnObject);
            observer.complete();
          },
          error1 => observer.error()
        );
      }
    });
  }


  getTrackedEntityInstanceWithEvents(key, stageKey, ou, ouMode = 'SELECTED', filter = '', startDate = null, endDate = null, dateType = 'program', page = 300): Observable<any> {
    return new Observable(observer => {
      const metadata = TrackedEntityTypes[key];
      if (!metadata) {
        observer.next([]);
        observer.complete();
      } else {
        const fieldFilters = '&fields=created,orgUnit,trackedEntityInstance,lastUpdated,enrollments[storedBy,enrollmentDate,enrollment,events[event,program,programStage,orgUnit,trackedEntityInstance,eventDate,storedBy,dataValues[dataElement,value]]],attributes[storedBy,value,attribute]';
        let eventUrl = `trackedEntityInstances.json?ou=${ou}&ouMode=${ouMode}&program=${metadata.program}&pageSize=${page}&${filter}${fieldFilters}`;
        if (startDate) {
          if (dateType === 'program') {
            eventUrl += `&programStartDate=${startDate}&programEndDate=${endDate}`;
          } else {
            eventUrl += `&lastUpdatedStartDate=${startDate}&lastUpdatedEndDate=${endDate}`;
          }
        }
        this.http.get(eventUrl).subscribe(
          (data) => {
            const returnObject = data.trackedEntityInstances.map(resultRow => {
              const dataObject: any = {};
              dataObject['id'] = resultRow['trackedEntityInstance'];
              metadata.attributes.forEach((attribute: any) => {
                const attribute_name = this._getAttributeKeyId(
                  metadata.attributes,
                  attribute.key
                );
                const dataElement = resultRow.attributes.find(item => item.attribute === attribute_name);
                if (dataElement) {
                  dataObject[attribute.key] = dataElement['value'];
                }
              });
              const enrollmentItem: any = resultRow['enrollments'][0];
              const enrollment_id: string = enrollmentItem
                ? enrollmentItem.enrollment
                : '';
              const enrollment_date: string = enrollmentItem
                ? enrollmentItem.enrollmentDate
                : '';
              const storedBy: string = enrollmentItem
                ? enrollmentItem.storedBy
                : '';
              const events = enrollmentItem ? enrollmentItem['events'] : [];
              return {
                ...dataObject,
                items: this.mapEventToObject(key, stageKey, events),
                enrollment_id: enrollment_id,
                organisation_unit_id: resultRow['orgUnit'],
                last_updated: resultRow['created'],
                created: enrollment_date,
                inactive: resultRow['inactive'],
                storedBy
              };
            });
            observer.next(returnObject);
            observer.complete();
          },
          error1 => observer.error()
        );
      }
    });
  }

  getOneTrackedEntityInstance(instanceId, key, stageKey): Observable<any> {
    const metadata = TrackedEntityTypes[key];
    const stage = metadata.stage[stageKey];
    return this.http.get(`trackedEntityInstances/${instanceId}.json?fields=*`)
      .pipe(map((resultRow: any) => {
          const dataObject: any = {};
          dataObject['id'] = resultRow['trackedEntityInstance'];
          metadata.attributes.forEach((attribute: any) => {
            const attribute_name = this._getAttributeKeyId(
              metadata.attributes,
              attribute.key
            );
            const dataElement = resultRow.attributes.find(item => item.attribute === attribute_name);
            if (dataElement) {
              dataObject[attribute.key] = dataElement['value'];
            }
          });
          const enrollments = resultRow['enrollments'][0];
          let items = [];
          let storedBy = '';
          if (enrollments) {
            storedBy = enrollments
              ? enrollments.storedBy
              : '';
            const events: any[] = enrollments['events'];
            if (events) {
              items = this.mapEventToObject(key, stageKey, events);
            }
          }
          return {
            ...dataObject,
            enrollment_id: enrollments ? enrollments.enrollment : '',
            organisation_unit_id: resultRow['orgUnit'],
            last_update: resultRow['lastUpdated'],
            created: enrollments ? enrollments.enrollmentDate : '',
            inactive: resultRow['inactive'],
            participants: items,
            storedBy
          };
        }, catchError(() => throwError(null)))
      );
  }

  getOneTeiWithEnrollmentIdsAndEventIds(instanceId): Observable<any> {
    return this.http.get(`trackedEntityInstances/${instanceId}.json?fields=trackedEntityInstance,enrollments[enrollment,events[event]]&paging=false`)
      .pipe(map((data: any) => {
        const enrollments = [];
        const events = [];
        if(data['enrollments']?.length) {
          data['enrollments'].forEach(e => {
            enrollments.push({enrollment: e.enrollment});
            events.push(...e.events);
          });
          return {enrollments, events};
        }
        }, catchError(() => throwError(null)))
      );
  }

  deleteMultipleEnrollmentsByIds(enrollments): Observable<any> {
    return this.http.post(`enrollments?strategy=DELETE`, {enrollments})
      .pipe(tap((data: any) => console.log('Enrollments deleted successfully'), catchError(() => throwError(null)))
      );
  }

  deleteMultipleEventsByIds(events): Observable<any> {
    return this.http.post(`events?strategy=DELETE`, {events})
      .pipe(tap((data: any) => console.log('Events deleted successfully'), catchError(() => throwError(null)))
      );
  }

  getOneTrackedEntityInstanceMultipleEvents(instanceId, key, stages: {[id: string]: string}): Observable<any> {
    const metadata = TrackedEntityTypes[key];
    return this.http.get(`trackedEntityInstances/${instanceId}.json?fields=*`)
      .pipe(map((resultRow: any) => {
          const dataObject: any = {};
          dataObject['id'] = resultRow['trackedEntityInstance'];
          metadata.attributes.forEach((attribute: any) => {
            const attribute_name = this._getAttributeKeyId(
              metadata.attributes,
              attribute.key
            );
            const dataElement = resultRow.attributes.find(item => item.attribute === attribute_name);
            if (dataElement) {
              dataObject[attribute.key] = dataElement['value'];
            }
          });
          const enrollments = resultRow['enrollments'][0];
          const items = {};
          let storedBy = '';
          if (enrollments) {
            storedBy = enrollments
              ? enrollments.storedBy
              : '';
            const events: any[] = enrollments['events'];
            Object.keys(stages).forEach(s => {
              items[s] = this.mapEventToObject(key, stages[s], events);
            });
          }
          return {
            ...dataObject,
            enrollment_id: enrollments ? enrollments.enrollment : '',
            organisation_unit_id: resultRow['orgUnit'],
            last_update: resultRow['lastUpdated'],
            created: enrollments ? enrollments.enrollmentDate : '',
            inactive: resultRow['inactive'],
            ...items,
            storedBy
          };
        }, catchError(() => throwError(null)))
      );
  }

  mapEventToObject(key, stageKey, events) {
    const metadata = TrackedEntityTypes[key];
    const stage = metadata.stage[stageKey];
    return events.filter(i => i.programStage === stage.id).map(
      event => {
        const eventDataObject = {};
        eventDataObject['id'] = event.event;
        eventDataObject['organisation_unit_id'] = event.orgUnit;
        eventDataObject['trackedEntityInstance'] = event.trackedEntityInstance;
        eventDataObject['enrollment'] = event.enrollment;
        eventDataObject['created'] = event.eventDate;
        eventDataObject['last_update'] = event.lastUpdated;
        eventDataObject['programStage'] = event.programStage;
        eventDataObject['storedBy'] = event.storedBy;
        stage.dataElements.forEach(element => {
          const attribute_name = this._getAttributeKeyId(
            stage.dataElements,
            element.key
          );
          const dataElement = event.dataValues.find(item => item.dataElement === attribute_name);
          if (dataElement) {
            eventDataObject[element.key] = dataElement['value'];
          }
        });
        return eventDataObject;
      }
    );
  }

  /**
   * this function will be used to prepare a dhis2 payload
   * @param key
   * @param ou
   * @param values
   * @param action
   * @param trackedEntityInstance
   * @param eventDate
   */
  prepareTrackedEntityPayload(
    key,
    ou,
    values,
    trackedEntityInstance = null,
    eventDate = null,
    enrollment = null,
  ) {
    const metadata = TrackedEntityTypes[key];
    const date = eventDate || new Date().toISOString().substring(0, 10);
    const useEnrolment = enrollment ? enrollment : this.makeid();
    const returnItem = {
      trackedEntityType: metadata.id,
      orgUnit: ou,
      trackedEntityInstance: trackedEntityInstance ? trackedEntityInstance : this.makeid(),
      attributes: metadata.attributes.map((attribute: any) => {
        return {
          attribute: attribute.id,
          value: values[attribute.key]
        };
      }),
      enrollments: [
        {
          orgUnit: ou,
          program: metadata.program,
          enrollmentDate: date,
          incidentDate: date,
          enrollment: useEnrolment,
        }
      ]
    };
    return returnItem;
  }

  /**
   * This function will prepare an event payload ready to be sent to the server
   * @param key
   * @param ou
   * @param trackedEntityInstance
   * @param stageKey
   * @param enrollment
   * @param values
   * @param event
   * @param date
   */
  prepareEvents(
    key,
    ou,
    trackedEntityInstance,
    stageKey,
    enrollment,
    values,
    event = null,
    date = null
  ) {
    const metadata = TrackedEntityTypes[key];
    const stage = metadata.stage[stageKey];
    const eventData = {
      program: metadata.program,
      programStage: stage.id,
      orgUnit: ou,
      notes: [],
      status: 'ACTIVE',
      eventDate: date ? date : new Date().toISOString().substring(0, 10),
      dataValues: stage.dataElements.map((dataElement: any) => {
        return {
          dataElement: dataElement.id,
          value: values[dataElement.key]
        };
      })
    };
    if (trackedEntityInstance !== null) {
      eventData['trackedEntityInstance'] = trackedEntityInstance;
    }
    if (enrollment !== null) {
      eventData['enrollment'] = enrollment;
    }
    if (event) {
      eventData['event'] = event;
    }
    return eventData;
  }

  prepareCompleteTrackedEntity(
    key,
    stageKey,
    ou,
    trackedEntityValues,
    eventValues,
    eventDate,
    enrollment = null,
    trackedEntityInstance = null
  ) {
    const metadata = TrackedEntityTypes[key];
    const stage = metadata.stage[stageKey];
    const useEnrolment = enrollment ? enrollment : this.makeid();
    const useTrackedEntityInstance = trackedEntityInstance ? trackedEntityInstance : this.makeid();

    const date = eventDate || new Date().toISOString().substring(0, 10);
    const returnItem = {
      trackedEntityType: metadata.id,
      trackedEntityInstance: useTrackedEntityInstance,
      orgUnit: ou,
      attributes: metadata.attributes.map((attribute: any) => {
        return {
          attribute: attribute.id,
          value: trackedEntityValues[attribute.key]
        };
      }),
      enrollments: [
        {
          orgUnit: ou,
          program: metadata.program,
          enrollment: useEnrolment,
          enrollmentDate: date ? date : new Date().toISOString().substring(0, 10),
          incidentDate: date ? date : new Date().toISOString().substring(0, 10),
          events: eventValues.map(event => {
            const eventId = event.id ? event.id : this.makeid();
            return {
              program: metadata.program,
              programStage: stage.id,
              orgUnit: ou,
              notes: [],
              status: 'ACTIVE',
              event: eventId,
              enrollment: useEnrolment,
              trackedEntityInstance: useTrackedEntityInstance,
              eventDate: date ? date : new Date().toISOString().substring(0, 10),
              dataValues: stage.dataElements.map((dataElement: any) => {
                return {
                  dataElement: dataElement.id,
                  value: event[dataElement.key]
                };
              })
            };
          })
        }
      ]
    };
    return returnItem;
  }

  prepareCompleteTrackedEntityMultipleStages(
    key,
    ou,
    trackedEntityValues,
    eventValues: {[key: string]: any[]},
    eventDate,
    enrollment = null,
    trackedEntityInstance = null
  ) {
    const metadata = TrackedEntityTypes[key];

    const useEnrolment = enrollment ? enrollment : this.makeid();
    const useTrackedEntityInstance = trackedEntityInstance ? trackedEntityInstance : this.makeid();

    const date = eventDate || new Date().toISOString().substring(0, 10);
    const returnItem = {
      trackedEntityType: metadata.id,
      trackedEntityInstance: useTrackedEntityInstance,
      orgUnit: ou,
      attributes: metadata.attributes.map((attribute: any) => {
        return {
          attribute: attribute.id,
          value: trackedEntityValues[attribute.key]
        };
      }),
      enrollments: [
        {
          orgUnit: ou,
          program: metadata.program,
          enrollment: useEnrolment,
          enrollmentDate: date ? date : new Date().toISOString().substring(0, 10),
          incidentDate: date ? date : new Date().toISOString().substring(0, 10),
          events: [].concat(...Object.keys(eventValues).map(stageKey => {
            const stage = metadata.stage[stageKey];
            return eventValues[stageKey].map(event => {
              const eventId = event.id ? event.id : this.makeid();
              return {
                program: metadata.program,
                programStage: stage.id,
                orgUnit: ou,
                notes: [],
                status: 'ACTIVE',
                event: eventId,
                enrollment: useEnrolment,
                trackedEntityInstance: useTrackedEntityInstance,
                eventDate: date ? date : new Date().toISOString().substring(0, 10),
                dataValues: stage.dataElements.map((dataElement: any) => {
                  return {
                    dataElement: dataElement.id,
                    value: event[dataElement.key]
                  };
                })
              };
            });
          })),
        }
      ]
    };
    return returnItem;
  }

  /**
   * finding the position of the item in rows- used when fetching data
   * @param analyticsObjectHeaders : Array
   * @param name : String ['ou','dx','co','pe',....]
   * @returns {number}
   * @private
   */
  _getTitleIndex(analyticsObjectHeaders, name: string) {
    return analyticsObjectHeaders.findIndex(item => item.name === name);
  }

  _getAttributeKeyId(attributes, key) {
    const attributeItem: any = attributes.find(item => item.key === key);
    return attributeItem ? attributeItem.id : null;
  }

  _getDataValuesElement(dataValues, dataElement) {
    return dataValues.find(item => item.dataElement === dataElement);
  }

  _getRowItems(position: number, array) {
    const return_array = [];
    for (const item of array) {
      if (return_array.indexOf(item[position]) === -1) {
        return_array.push(item[position]);
      }
    }
    return return_array;
  }
}
