import { createAction, props } from '@ngrx/store';
import { Case } from './case.model';

export const loadCases = createAction(
  '[Case] Load Cases'
);

export const upsertCase = createAction('[Case] Upsert Case', props<{ caseObject: Case }>());
export const upsertCases = createAction('[Case] Upsert Cases', props<{ cases: Case[] }>());

