import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.scss']
})
export class ImportarComponent implements OnInit {

  needColumns: string[] = [
    'referencia', 'descripcion', 'precio', 'stockCant', 'onStock', 'imagenUrl'
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
