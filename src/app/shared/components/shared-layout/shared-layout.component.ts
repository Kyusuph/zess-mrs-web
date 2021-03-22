import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shared-layout',
  templateUrl: './shared-layout.component.html',
  styleUrls: ['./shared-layout.component.scss']
})
export class SharedLayoutComponent implements OnInit {
  @Input() title='';
  constructor() { }

  ngOnInit(): void {
  }

}
