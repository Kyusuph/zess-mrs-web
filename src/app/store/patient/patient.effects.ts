import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BasicDataService } from '../../services/basic-data.service';
import * as patientActions from './patient.actions';
import {DataStoreKeys} from '../dataStoreKeys';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Patient } from './patient.model';

@Injectable()
export class PatientEffects {



  constructor(private actions$: Actions, private basicService:BasicDataService) {}

  patients$ = createEffect(() => this.actions$.pipe(ofType(patientActions.getPatients), mergeMap(() => this.basicService.getDetailedListUsingSqlView(DataStoreKeys.Patients).pipe(map((patients:Patient[]) => patientActions.upsertPatients({patients})
  ), catchError(() => EMPTY)))));

}
