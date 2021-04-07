import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fadeIn } from '../../animations/router-animation';
import { TableConfiguration } from '../../app-table-configuration';

@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.scss'],
  animations: [fadeIn]
})
export class AppTableComponent implements OnInit, OnChanges {

  @Input() tableConfiguration: TableConfiguration

  @Input() tableList: any[];
  @Output() viewItemDetails = new EventEmitter();
  @Output() updateItemDetails = new EventEmitter();
  @Output() deletingItem = new EventEmitter();

  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  showActions = false;

  constructor() { }

  ngOnInit(): void {
    this.initData();
  }

  ngOnChanges() {
    this.initData();
  }

  initData() {
    this.tableConfiguration = {
      ...this.tableConfiguration,
      actionButtons: this.tableConfiguration.actionButtons ? this.tableConfiguration.actionButtons : {
        edit: false,
        delete: false,
        view: false,
        customButton: false
      }
    }
    this.dataSource = new MatTableDataSource(this.tableList);
    this.displayedColumns = ['position', ...this.tableConfiguration.tableColumns.map(column => column.name)];
    this.showActions = this.tableList.length && this.tableConfiguration.actionButtons.customButton || this.tableConfiguration.actionButtons.delete || this.tableConfiguration.actionButtons.edit || this.tableConfiguration.actionButtons.view;
    if (this.showActions) {
      this.displayedColumns.push('actions');
    }
  }

  updateItem(event) {
    console.log('updating', event);
    this.updateItemDetails.emit(event)
  }

  deleteItem(event) {
    console.log('deleting', event);
    this.deletingItem.emit(event);
  }

  viewItem(event) {
    console.log('viewing', event);
    this.viewItemDetails.emit(event);
  }

}
