import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management/user-management.component';
import { SharedModule } from '../../shared/shared.module';
import { UserRoutingModule } from './users-routing.module';
import { MaterialModule } from '../material/material.module';




@NgModule({
  declarations: [UserManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    MaterialModule
  ]
})
export class UsersModule { }
