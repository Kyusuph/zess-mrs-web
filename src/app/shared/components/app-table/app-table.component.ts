import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.scss']
})
export class AppTableComponent implements OnInit, OnChanges {

  @Input() tableConfiguration: {
    tableColumns: { name: string, label: string }[],
  }

  @Input() tableList: any[];

  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.tableList);
    this.displayedColumns = ['position', ...this.tableConfiguration.tableColumns.map(column => column.name)];
    console.log('displayed columns', this.displayedColumns);
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.tableList);
    this.displayedColumns = ['position', ...this.tableConfiguration.tableColumns.map(column => column.name)];
    console.log('displayed columns', this.displayedColumns);
  }

}
