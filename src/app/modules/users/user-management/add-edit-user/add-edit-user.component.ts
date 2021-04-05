import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationState } from '../../../../store';
import { Store } from '@ngrx/store';
import { upsertUser } from '../../../../store/user/user.actions';
import { User } from 'src/app/store/user/user.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  currentUser: User;
  constructor(private formBuilder: FormBuilder, private store: Store<ApplicationState>, private dialogRef: MatDialogRef<AddEditUserComponent>, private userService: UserService, @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      'firstname': ['', Validators.required],
      'middlename': [''],
      'username': ['', Validators.required],
      'surname': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'phoneNumber': ['', Validators.required],
      'password': ['', Validators.required],
      'gender': ['', Validators.required]
    })

    if (this.data) {
      this.currentUser = this.data.currentUser;
      this.userForm.patchValue({
        firstname: this.currentUser.firstName,
        middlename: this.currentUser.middlename,
        username: this.currentUser.username,
        email: this.currentUser.email,
        phoneNumber: this.currentUser.phoneNumber,
        gender: this.currentUser.gender,
        surname:this.currentUser.surname
      })
    }
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

  async onSave(formData) {
    this.loading = true;
    const userObject: User = {
      id: this.currentUser ? this.currentUser.id : this.makeId(),
      firstName: formData['firstname'],
      surname: formData['surname'],
      phoneNumber: formData['phoneNumber'],
      email: formData['email'],
      gender: formData['gender'],
      middlename: formData['middleName'],
      organisationUnits: [{ id: 'YGvqjmuDP6W' }],
      userCredentials: {
        id: this.currentUser ? this.currentUser.userCredentials.id : this.makeId(),
        userInfo: this.currentUser ? this.currentUser.userCredentials.userInfo : {
          id: this.makeId()
        },
        username: formData['username'],
      }
    }
    if(!this.currentUser) {
      userObject.userCredentials = {
        ...userObject.userCredentials,
        password:formData['password']
      }
    }
    try {
      await this.userService.addDHISUser(userObject).toPromise();
      this.store.dispatch(upsertUser({ user: userObject }))
    } catch (e) {
      console.error(e)
    }
    this.loading = false;
    this.onClose();
  }

  onClose() {
    this.dialogRef.close();
  }



}
