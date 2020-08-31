import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CacheService } from '../../../../../../../../../../../Gdev-Tools/cache/cache.service';
import { RespuestaModel, FormPredefinida, RespuestaSugerencias, RespuestaCard } from '../../../respuesta.model';
import { FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'aSmart-predefinida',
  templateUrl: './predefinida-form.component.html',
  styleUrls: ['./predefinida-form.component.scss']
})
export class PredefinidaFormComponent implements OnInit {

  respPredef: FormPredefinida

  @Output() onRespChanges: EventEmitter<FormPredefinida> = new EventEmitter()

  constructor (
    public resService: RespuestasService,
    private _cache: CacheService
  ) {
    this.respPredef = new FormPredefinida('texto','')
    this.resService.initRespData()
   }

  ngOnInit(): void {
  }

  

  onEstiloRespuesta( estiloSelected: MatSelectChange ) {
    this.respPredef.estiloRespuesta = estiloSelected.value
    this.onRespChanges.emit(this.respPredef)
  }

  catchSugerencias(respuesta: RespuestaSugerencias) {
    this.respPredef.mensaje = respuesta
  }

  catchCard( respuesta: RespuestaCard ) {
    this.respPredef.mensaje = respuesta
  }


  

}
