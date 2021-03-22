import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {
  userForm:FormGroup;
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      'firstname': ['', Validators.required],
      'middlename': [''],
      'surname': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'phoneNumber': ['', Validators.required],
      'password': ['', Validators.required]
    })
  }

  onSave() {
  }

}
