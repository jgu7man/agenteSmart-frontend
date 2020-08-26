import { Component, OnInit } from '@angular/core';
import { IntentModel } from '../../mensaje.model';
import { Location } from '@angular/common';
import { CurrentMensajeService } from '../current-mensaje.service';

@Component({
  selector: 'aSmart-entrenamiento',
  templateUrl: './entrenamiento.component.html',
  styleUrls: ['./entrenamiento.component.scss']
})
export class EntrenamientoComponent implements OnInit {

  mensajeName: string
  mensaje: IntentModel

  constructor (
    public location: Location,
    private _mensaje: CurrentMensajeService
  ) {}

  ngOnInit(): void {
    this.getMensaje()
    
  }

  async getMensaje() {
    this._mensaje.currentMensaje$.subscribe( current => {
      this.mensaje = current.mensaje
    })
  }
  
  onSubmit() {
    
  }
  
  
  

  
  



}



