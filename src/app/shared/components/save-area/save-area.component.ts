import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { emit } from 'process';

@Component({
  selector: 'save-area',
  templateUrl: './save-area.component.html',
  styleUrls: ['./save-area.component.scss']
})
export class SaveAreaComponent implements OnInit {
  @Output() save = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  onSave(){
    this.save.emit();
  }
}
