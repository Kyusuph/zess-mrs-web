import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppTableComponent} from './components/app-table/app-table.component';
import { MatTableModule } from '@angular/material/table';
import { SharedLayoutComponent } from './components/shared-layout/shared-layout.component';
import {MaterialModule} from '../modules/material/material.module';
import { SaveAreaComponent } from './components/save-area/save-area.component';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';



@NgModule({
  declarations: [AppTableComponent, SharedLayoutComponent, SaveAreaComponent, AppLoaderComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MaterialModule
  ],
  exports:[
    SharedLayoutComponent,
    AppTableComponent,
    SaveAreaComponent,
    AppLoaderComponent
  ]
})
export class SharedModule { }
