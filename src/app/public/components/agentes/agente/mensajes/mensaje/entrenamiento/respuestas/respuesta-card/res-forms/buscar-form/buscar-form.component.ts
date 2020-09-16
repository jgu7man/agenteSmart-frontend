import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { CacheService } from '../../../../../../../../../../../Gdev-Tools/cache/cache.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormBuscar, FormPredefinida } from '../../../respuesta.model';

@Component({
  selector: 'aSmart-buscar-form',
  templateUrl: './buscar-form.component.html',
  styleUrls: ['./buscar-form.component.scss']
})
export class BuscarFormComponent implements OnInit {

  @Input() response

  paramSelected: string
  // dataBases: any[]
  dataBaseSelected: string
  
  @Output() onRespChanges: EventEmitter<FormPredefinida> = new EventEmitter()
  respBuscar: FormBuscar
  constructor (
    public resService: RespuestasService,
    private _cache: CacheService
  ) {
    this.respBuscar = new FormBuscar('texto', '', this.paramSelected, this.dataBaseSelected)
   }

  ngOnInit(): void {
  }



  catchOutputMessage( msg: FormPredefinida ) {
    this.respBuscar.estiloRespuesta = msg.estiloRespuesta
    this.respBuscar.respuesta = msg.respuesta
    this.onRespChanges.emit(this.respBuscar)
  }

}
