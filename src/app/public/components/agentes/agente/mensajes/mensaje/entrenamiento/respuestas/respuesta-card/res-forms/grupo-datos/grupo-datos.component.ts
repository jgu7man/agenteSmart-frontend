import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { CacheService } from '../../../../../../../../../../../Gdev-Tools/cache/cache.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormPredefinida, FormRegistroDatos } from '../../../respuesta.model';

@Component({
  selector: 'aSmart-grupo-datos',
  templateUrl: './grupo-datos.component.html',
  styleUrls: ['./grupo-datos.component.scss']
})
export class GrupoDatosComponent implements OnInit {

  paramSelected: string
  dataGroups: any[]
  dataGroupSelected: string

  resData: FormRegistroDatos

  @Output() onRespChanges: EventEmitter<FormPredefinida> = new EventEmitter()
  constructor (
    public resService: RespuestasService,
    private _cache: CacheService
  ) {
    this.resData = new FormRegistroDatos('texto','',this.paramSelected, this.dataGroupSelected)
   }

  ngOnInit(): void {
  }

  catchOutputMessage( msg: FormPredefinida ) {
    this.resData.estiloRespuesta = msg.estiloRespuesta
    this.resData.mensaje = msg.mensaje
    this.onRespChanges.emit( this.resData )
  }

  
}
