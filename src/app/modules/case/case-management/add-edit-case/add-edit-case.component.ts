import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ApplicationState } from '../../../../store';
import { Patient } from '../../../../store/patient/patient.model';
import { AddEditPatientComponent } from '../../../patients/patient-management/add-edit-patient/add-edit-patient.component';
import * as patientsSelector from '../../../../store/patient/patient.selectors';
import { Case } from 'src/app/store/case/case.model';
import { BasicDataService } from 'src/app/services/basic-data.service';
import { CommonService } from 'src/app/services/common.service';
import { User } from 'src/app/store/user/user.model';
import { TrackerService } from 'src/app/services/tracker.service';
import { upsertCase } from 'src/app/store/case/case.actions';
@Component({
  selector: 'app-add-edit-case',
  templateUrl: './add-edit-case.component.html',
  styleUrls: ['./add-edit-case.component.scss']
})
export class AddEditCaseComponent implements OnInit {
  caseForm: FormGroup;
  patientSearch = '';
  currentUser: User;
  patients$: Observable<Patient[]>
  loading: boolean;
  constructor(private trackerService: TrackerService, private basicService: BasicDataService, private commonService: CommonService, private store: Store<ApplicationState>, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddEditCaseComponent>, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.caseForm = this.formBuilder.group({
      caseNumber: ['', Validators.required],
      patient: ['', Validators.required],
      date: ['', Validators.required],
      status: ['', Validators.required]
    })
    this.patients$ = this.store.pipe(select(patientsSelector.selectAll));
    const user = localStorage.getItem('user-object')
    this.currentUser = JSON.parse(user);
  }

  onClose() {
    this.dialogRef.close()
  }

  async onSave() {
    this.loading = true;
    const formData = this.caseForm.value;
    const caseObject: Case = {
      id: this.commonService.makeId(),
      case_date: new Date().toISOString(),
      case_number: formData['caseNumber'],
      complaints: '',
      customer_id: null,
      patient_id: formData['patient'],
      status: formData['status'],
      notes: '',
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      reported: '',
      user_id: this.currentUser.id,
      franchise: ''
    }
    try {
      const case_to_save = this.trackerService.prepareTrackedEntityPayload('CaseEntity','Jm79zeWPhHM',caseObject,caseObject.id);
      await this.trackerService.saveTrackedEntity(case_to_save).toPromise();
      this.store.dispatch(upsertCase({caseObject:caseObject}));
      this.basicService.showSuccess('Case saved successfully');
    } catch (e) {
      console.error('Failed to save case', e);
      this.basicService.showError('Failed to save case');
    }
    this.loading =false;
    this.onClose();
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
