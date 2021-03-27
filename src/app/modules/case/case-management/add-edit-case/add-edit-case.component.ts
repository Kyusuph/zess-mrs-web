import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddEditPatientComponent } from '../../../patients/patient-management/add-edit-patient/add-edit-patient.component';

@Component({
  selector: 'app-add-edit-case',
  templateUrl: './add-edit-case.component.html',
  styleUrls: ['./add-edit-case.component.scss']
})
export class AddEditCaseComponent implements OnInit {
  caseForm: FormGroup;
  patientSearch = '';
  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddEditCaseComponent>, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.caseForm = this.formBuilder.group({
      caseNumber: ['', Validators.required],
      patient: ['', Validators.required],
      date: ['', Validators.required],
      status: ['', Validators.required]
    })
  }

  onClose() {
    this.dialogRef.close()
  }

  onSave() {

  }

  addCustomer() {
    const dialogRef = this.dialog.open(AddEditPatientComponent, {
      width: '90%',
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(result => {
      this.caseForm.patchValue({
        patient: result
      });
    }).unsubscribe();
  }

}
