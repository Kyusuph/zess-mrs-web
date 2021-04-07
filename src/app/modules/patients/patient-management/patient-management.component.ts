import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditPatientComponent } from './add-edit-patient/add-edit-patient.component';
import * as patientSelector from '../../../store/patient/patient.selectors';
import { ApplicationState } from 'src/app/store';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Patient } from 'src/app/store/patient/patient.model';

@Component({
  selector: 'app-patient-management',
  templateUrl: './patient-management.component.html',
  styleUrls: ['./patient-management.component.scss']
})
export class PatientManagementComponent implements OnInit {
  tableConfiguration = {
    tableColumns: [
      { name: 'firstName', label: 'First Name' },
      { name: 'surname', label: 'Surname' },
      { name: 'phoneNumber', label: 'Phone Number' },
      // { name: 'insurance', label: 'Insurance' },
      { name: 'address', label: 'Address' },
      { name: 'gender', label: 'Gender' }
    ]
  }
  patients$:Observable<Patient[]>;
  constructor(private dialog: MatDialog, private store:Store<ApplicationState>) { }

  ngOnInit(): void {
    this.patients$ = this.store.pipe(select(patientSelector.selectAll));
  }

  onAdd() {
    this.dialog.open(AddEditPatientComponent, {
      width: '90%',
      disableClose: true
    })
  }

}
