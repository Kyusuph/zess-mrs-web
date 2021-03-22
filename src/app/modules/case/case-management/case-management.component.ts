import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationState } from '../../../store';
import {Store} from '@ngrx/store';
import { Case } from '../../../store/case/case.model';
import * as caseSelector from '../../../store/case/case.selectors';

@Component({
  selector: 'app-case-management',
  templateUrl: './case-management.component.html',
  styleUrls: ['./case-management.component.scss']
})
export class CaseManagementComponent implements OnInit {
  tableConfiguration = {
    tableColumns:[
      {name:'caseNumber', label:'Case Number'},
      {name: 'patient', label:'Patient'},
      {name: 'notes', label:'Notes'},
      {name:'complaints', label:'Complaints'},
      {name:'status', label:'Status'}
    ]
  }
  cases$:Observable<Case[]>
  constructor(private store:Store<ApplicationState>) { }

  ngOnInit(): void {
    this.cases$ = this.store.select(caseSelector.selectAll);
  }

}
