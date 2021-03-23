import { createAction, props } from '@ngrx/store';
import { Patient } from './patient.model';

export const loadPatients = createAction(
  '[Patient] Load Patients'
);

export const upsertPatient = createAction('[Patient] Upsert Patient', props<{ patient: Patient }>());
export const upsertPatients = createAction('[Patient] Upsert Patients', props<{ patients: Patient[] }>());




