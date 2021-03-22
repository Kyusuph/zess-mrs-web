import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss']
})
export class CustomerManagementComponent implements OnInit {
  tableConfiguration = {
    tableColumns: [
      {name:'firstname', label:'First Name'},
      {name:'surname', label:'Surname'},
      {name:'phoneNumber', label:'Phone Number'},
      // {}
    ]
  }
  constructor() { }

  ngOnInit(): void {
  }

}
