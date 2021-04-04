import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicationState } from 'src/app/store';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/store/user/user.model';
import * as userSelector from '../../../store/user/user.selectors';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  tableConfiguration = {
    tableColumns: [
      { name: 'firstName', label: 'First Name' },
      { name: 'surname', label: 'Surname' },
      { name: 'phoneNumber', label: 'Phone Number' },
      { name: 'email', label: 'Email' }

    ]
  }
  users$: Observable<User[]>;
  users:User[] = [];
  constructor(private dialog: MatDialog, private store: Store<ApplicationState>) { }

  ngOnInit() {
    this.users$ = this.store.select(userSelector.selectAll);
    this.users$.subscribe(users => {
      this.users = users;
      console.log('users', users);
    })
  }

  addUser() {
    this.dialog.open(AddEditUserComponent, {
      disableClose: true
    });
  }

  onClose() {
    this.dialog.closeAll();
  }

}
