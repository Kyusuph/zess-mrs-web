import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CaseManagementComponent } from './case-management/case-management.component';

const routes:Routes = [
  {
    path: '',
    component:CaseManagementComponent
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class CaseRoutingModule { }
