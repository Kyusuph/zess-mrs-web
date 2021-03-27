import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationState } from '../../../../store';
import { Store } from '@ngrx/store';
import { upsertUser } from '../../../../store/user/user.actions';
import { User } from 'src/app/store/user/user.model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {
  userForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private store: Store<ApplicationState>, private dialogRef:MatDialogRef<AddEditUserComponent>) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      'firstname': ['', Validators.required],
      'middlename': [''],
      'surname': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'phoneNumber': ['', Validators.required],
      'password': ['', Validators.required],
      'gender':['', Validators.required]
    })
  }

  makeId(): string {
    let text = '';
    const first_letter_possible_combinations =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const possible_combinations =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 11; i++) {
      if (i === 0) {
        text += first_letter_possible_combinations.charAt(
          Math.floor(Math.random() * first_letter_possible_combinations.length)
        );
      } else {
        text += possible_combinations.charAt(
          Math.floor(Math.random() * possible_combinations.length)
        );
      }
    }
    return text;
  }

  onSave(formData) {
    const userObject: User = {
      id: this.makeId(),
      firstname: formData['firstname'],
      surname: formData['surname'],
      phoneNumber: formData['phoneNumber'],
      email: formData['email'],
      gender: formData['gender'],
      middlename: formData['middleName']
    }
    this.store.dispatch(upsertUser({ user: userObject }))
    this.onClose();
  }

  onClose() {
    this.dialogRef.close();
  }



}
