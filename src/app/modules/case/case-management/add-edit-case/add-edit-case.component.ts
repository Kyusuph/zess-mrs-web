import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-case',
  templateUrl: './add-edit-case.component.html',
  styleUrls: ['./add-edit-case.component.scss']
})
export class AddEditCaseComponent implements OnInit {
  caseForm:FormGroup;
  patientSearch = '';
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.caseForm = this.formBuilder.group({
      caseNumber:['', Validators.required],
      patient:['', Validators.required],
      date:['', Validators.required],
      status:['',Validators.required]
    })
  }

}
