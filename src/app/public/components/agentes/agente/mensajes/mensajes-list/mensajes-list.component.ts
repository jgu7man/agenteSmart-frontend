import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'aSmart-mensajes-list',
  templateUrl: './mensajes-list.component.html',
  styleUrls: ['./mensajes-list.component.scss']
})
export class MensajesListComponent implements OnInit {


  @Input() contexto

  constructor() { }

  ngOnInit(): void {
  }

}
