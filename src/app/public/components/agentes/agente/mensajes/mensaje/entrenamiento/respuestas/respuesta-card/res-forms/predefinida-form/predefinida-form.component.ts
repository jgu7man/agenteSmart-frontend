import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { FormPredefinida, RespuestaSugerencias, RespuestaCard} from '../../../respuesta.model';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'aSmart-predefinida',
  templateUrl: './predefinida-form.component.html',
  styleUrls: ['./predefinida-form.component.scss']
})
export class PredefinidaFormComponent implements OnInit {

  @Input() outputRes: FormPredefinida 
 
  @Output() onRespChanges: EventEmitter<FormPredefinida> = new EventEmitter()

  constructor (
    public resService: RespuestasService,
  ) {
   }

  ngOnInit(): void {
  }

  catchText( text: string ) {
    this.outputRes.respuesta = text
    this.onRespChanges.emit(this.outputRes)
  }
  
  onEstiloRespuesta( estiloSelected: MatSelectChange ) {
    this.outputRes.estiloRespuesta = estiloSelected.value
    this.onRespChanges.emit( this.outputRes)
  }

  catchSugerencias( respuesta: RespuestaSugerencias ) {
    this.outputRes.respuesta = respuesta
    this.onRespChanges.emit( this.outputRes )
  }

  catchCard( respuesta: RespuestaCard ) {
    this.outputRes.respuesta = respuesta
    this.onRespChanges.emit( this.outputRes )
  }

  
  

}
