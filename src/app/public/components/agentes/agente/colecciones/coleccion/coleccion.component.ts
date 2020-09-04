import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ColeccionModel, ColeccionDato } from '../collection.interface';
import { Observable, fromEvent, Subject, Subscription, from } from 'rxjs';
import { debounceTime, switchMap, pluck, distinctUntilChanged, map, last } from 'rxjs/operators';
import { ColeccionesService } from '../colecciones.service';
import { MatSelectChange } from '@angular/material/select';
import { AlertService } from '../../../../../../Gdev-Tools/alerts/alert.service';

@Component({
  selector: 'aSmart-coleccion',
  templateUrl: './coleccion.component.html',
  styleUrls: ['./coleccion.component.scss']
})
export class ColeccionComponent implements OnInit {

  @Input() coleccion: ColeccionModel
  @Output() close = new EventEmitter<any>()

  newTipoColeccion = ''
  newColeccionDato: ColeccionDato = {
    identificador: '', valor: ''
  }

  constructor (
    private _colecciones: ColeccionesService,
    private _alerta: AlertService
  ) {
    this.coleccion = new ColeccionModel('', '')
   }

  ngOnInit(): void {
  }


  addDato() {
    let newDato
    if ( this.coleccion.colDatos ) {
      newDato = this.coleccion.colDatos.find(
          dato => dato.identificador == this.newColeccionDato.identificador );
    }
    
    if ( newDato ) {
      this._alerta.sendMessageAlert('Ese identificador ya existe. Cada identificador debe ser diferente') 
    } else {
      this.coleccion.colDatos.push(this.newColeccionDato)
      this._colecciones.addDatoColeccion( this.coleccion )
        .then( () => { this.newColeccionDato = { identificador: '', valor: ''}})
    }
    
  }

  

}
