import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseManagementComponent } from './case-management/case-management.component';
import {SharedModule} from '../../shared/shared.module';
import {CaseRoutingModule} from './case-routing.module';



@NgModule({
  declarations: [CaseManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    CaseRoutingModule
  ]
})
export class CaseModule { }
