import { Component, OnInit, Input } from '@angular/core';
import { Clase } from '../../tipo.model';

@Component({
  selector: 'aSmart-clase-item',
  templateUrl: './clase-item.component.html',
  styleUrls: ['./clase-item.component.scss']
})
export class ClaseItemComponent implements OnInit {

  switchClaseInput: boolean = false
  @Input() clase: Clase

  constructor() { }

  ngOnInit(): void {
  }

}
