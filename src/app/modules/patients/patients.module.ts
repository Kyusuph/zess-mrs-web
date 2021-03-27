import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientManagementComponent } from './patient-management/patient-management.component';
import {SharedModule} from '../../shared/shared.module';
import {PatientRoutingModule} from './patient-routing.module';
import {MaterialModule} from '../material/material.module';
import { AddEditPatientComponent } from './patient-management/add-edit-patient/add-edit-patient.component';



@NgModule({
  declarations: [PatientManagementComponent, AddEditPatientComponent],
  imports: [
    CommonModule,
    SharedModule,
    PatientRoutingModule,
    MaterialModule
  ]
})
export class PatientsModule { }
