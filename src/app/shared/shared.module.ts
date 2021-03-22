import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppTableComponent} from './components/app-table/app-table.component';
import { MatTableModule } from '@angular/material/table'  



@NgModule({
  declarations: [AppTableComponent],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports:[
    AppTableComponent
  ]
})
export class SharedModule { }
