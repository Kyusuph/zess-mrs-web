import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  tableConfiguration = {
    tableColumns : [
      {name:'name', label:'Name'}
    ]
  }
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addUser() {
    this.dialog.open(AddEditUserComponent, {
      disableClose:true
    });
  }

  onClose() {
    this.dialog.closeAll();
  }

}
