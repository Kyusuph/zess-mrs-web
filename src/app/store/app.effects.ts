import { CaseEffects } from './case/case.effects';
import { PatientEffects } from './patient/patient.effects';
import { RouterEffects } from './router/router.effect';
import { UserEffects } from './user/user.effects';

export const effects: any[] = [
  RouterEffects,
  UserEffects,
  PatientEffects,
  CaseEffects
];
