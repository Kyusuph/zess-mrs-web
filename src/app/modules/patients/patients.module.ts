import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientManagementComponent } from './patient-management/patient-management.component';
import {SharedModule} from '../../shared/shared.module';
import {PatientRoutingModule} from './patient-routing.module';



@NgModule({
  declarations: [PatientManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    PatientRoutingModule
  ]
})
export class PatientsModule { }
