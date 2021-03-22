import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-management',
  templateUrl: './patient-management.component.html',
  styleUrls: ['./patient-management.component.scss']
})
export class PatientManagementComponent implements OnInit {
  tableConfiguration = {
    tableColumns: [
      { name: 'firstname', label: 'First Name' },
      { name: 'surname', label: 'Surname' },
      { name: 'phoneNumber', label: 'Phone Number' },
      { name: 'insurance', label: 'Insurance' },
      { name: 'address', label: 'Address' },
      { name: 'gender', label: 'Gender' }
    ]
  }
  constructor() { }

  ngOnInit(): void {
  }

}
