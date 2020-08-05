import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'aSmart-entradas-list',
  templateUrl: './entradas-list.component.html',
  styleUrls: ['./entradas-list.component.scss']
})
export class EntradasListComponent implements OnInit {


  @Input() contexto

  constructor() { }

  ngOnInit(): void {
  }

}
