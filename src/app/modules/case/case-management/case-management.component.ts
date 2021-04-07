import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationState } from '../../../store';
import { Store } from '@ngrx/store';
import { Case } from '../../../store/case/case.model';
import * as caseSelector from '../../../store/case/case.selectors';
import { MatDialog } from '@angular/material/dialog';
import { AddEditCaseComponent } from './add-edit-case/add-edit-case.component';

@Component({
  selector: 'app-case-management',
  templateUrl: './case-management.component.html',
  styleUrls: ['./case-management.component.scss']
})
export class CaseManagementComponent implements OnInit {
  tableConfiguration = {
    tableColumns: [
      { name: 'case_number', label: 'Case Number' },
      { name: 'patient_name', label: 'Patient' },
      { name: 'notes', label: 'Notes' },
      { name: 'complaints', label: 'Complaints' },
      { name: 'status', label: 'Status' }
    ]
  }
  cases$: Observable<Case[]>
  constructor(private store: Store<ApplicationState>, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.cases$ = this.store.select(caseSelector.selectDetailed);
  }

  onAdd() {
    this.dialog.open(AddEditCaseComponent,{
      disableClose:true,
      width:'90%'
    })
  }

}
