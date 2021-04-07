import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BasicDataService } from 'src/app/services/basic-data.service';
import { DataStoreKeys } from 'src/app/store/dataStoreKeys';
import { upsertPatient } from 'src/app/store/patient/patient.actions';
import { CommonService } from '../../../../services/common.service';
import { ApplicationState } from '../../../../store';
import { Patient } from '../../../../store/patient/patient.model';

@Component({
  selector: 'app-add-edit-patient',
  templateUrl: './add-edit-patient.component.html',
  styleUrls: ['./add-edit-patient.component.scss']
})
export class AddEditPatientComponent implements OnInit {
  patientForm: FormGroup;
  loading = false;
  constructor(private dialogRef: MatDialogRef<AddEditPatientComponent>, private formBuilder: FormBuilder, private store: Store<ApplicationState>, private commonService: CommonService, private basicService:BasicDataService) { }

  ngOnInit(): void {
    this.patientForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      middlename: [''],
      surname: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      dob: ['', Validators.required]
    })
  }

  async onSave(formData) {
    this.loading = true;
    const patientObject: Patient = {
      id: this.commonService.makeId(),
      firstName: formData['firstname'],
      middleName: formData['middlename'],
      surname: formData['surname'],
      address: formData['address'],
      gender: formData['gender'],
      phoneNumber: formData['phoneNumber'],
      dob: new Date(formData['dob']).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    try {
      await this.basicService.saveToDataStore(DataStoreKeys.Patients,patientObject.id,patientObject).toPromise();
      this.store.dispatch(upsertPatient({ patient: patientObject }));
      this.basicService.showSuccess('Patient Saved Successfully')
    }catch(e){
      console.error('Failed to save patient');
      this.basicService.showError('Failed to save patient')
    }
    this.loading = false;
    this.onCancel();
  }

  onCancel() {
    this.dialogRef.close('closing')
  }

}
