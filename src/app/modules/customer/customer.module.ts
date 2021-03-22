import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import {CustomerRoutingModule} from './customer-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {MaterialModule} from '../../modules/material/material.module';



@NgModule({
  declarations: [CustomerManagementComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    MaterialModule
  ]
})
export class CustomerModule { }
