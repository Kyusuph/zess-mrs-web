import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.scss']
})
export class AppTableComponent implements OnInit {

  @Input() tableConfiguration : {
    tableColumns:{name:string,label:string}[],
  }

  @Input() tableList:any[];

  displayedColumns:string[];
  dataSource:MatTableDataSource<any>;

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.tableList);
    this.displayedColumns = ['Position', ...this.tableConfiguration.tableColumns.map(column => column.label)];
  }

}
