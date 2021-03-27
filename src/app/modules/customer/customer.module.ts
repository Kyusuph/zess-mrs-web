import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import {CustomerRoutingModule} from './customer-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {MaterialModule} from '../../modules/material/material.module';
import { AddEditCustomerComponent } from './customer-management/add-edit-customer/add-edit-customer.component';



@NgModule({
  declarations: [CustomerManagementComponent, AddEditCustomerComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    MaterialModule
  ]
})
export class CustomerModule { }
