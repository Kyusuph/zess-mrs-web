import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicationState } from 'src/app/store';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/store/user/user.model';
import * as userSelector from '../../../store/user/user.selectors';
import { TableConfiguration } from 'src/app/shared/app-table-configuration';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  tableConfiguration: TableConfiguration = {
    tableColumns: [
      { name: 'firstName', label: 'First Name' },
      { name: 'surname', label: 'Surname' },
      { name: 'phoneNumber', label: 'Phone Number' },
      { name: 'email', label: 'Email' }
    ],
    actionButtons: {
      edit: false,
      delete: false,
      view: false,
      customButton: false
    }
  }
  users$: Observable<User[]>;
  users: User[] = [];
  constructor(private dialog: MatDialog, private store: Store<ApplicationState>) { }

  ngOnInit() {
    this.users$ = this.store.select(userSelector.selectDetailed);
  }

  addUser() {
    this.dialog.open(AddEditUserComponent, {
      disableClose: true
    });
  }

  async updateUser(userId) {
    const user = await this.store.pipe(select(userSelector.selectById(userId)), first(i => !!i)).toPromise();
    this.dialog.open(AddEditUserComponent, {
      disableClose: true,
      data: { currentUser: user }
    });

  }

  onClose() {
    this.dialog.closeAll();
  }

}
