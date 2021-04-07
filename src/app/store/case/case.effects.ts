import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TrackerService } from 'src/app/services/tracker.service';
import * as caseActions from './case.actions';
import { Case } from './case.model';


@Injectable()
export class CaseEffects {
  constructor(private actions$: Actions, private trackerService:TrackerService) {}

  cases$ = createEffect(() => this.actions$.pipe(ofType(caseActions.getCases), mergeMap(() => this.trackerService.getTrackedEntityInstance('CaseEntity','Jm79zeWPhHM').pipe(map((cases:Case[]) => caseActions.upsertCases({cases})
  ), catchError(() => EMPTY)))));

}
