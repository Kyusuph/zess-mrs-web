import { createAction, props } from '@ngrx/store';
import { Measurement } from './measurement.model';

export const loadCases = createAction(
  '[Measurement] Load Measurements'
);

export const upsertMeasurement = createAction('[Measurement] Upsert Measurement', props<{ measurementObject: Measurement }>());
export const upsertMeasurements = createAction('[Measurement] Upsert Measurements', props<{ measurements: Measurement[] }>());

