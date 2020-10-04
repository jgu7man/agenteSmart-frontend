import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FraseParte, FraseEntrenamiento } from '../../../../mensaje.model';
import { FrasesService } from '../frases.service';

@Component({
  selector: 'aSmart-frase-parameters',
  templateUrl: './frase-parameters.component.html',
  styleUrls: ['./frase-parameters.component.scss']
})
export class FraseParametersComponent implements OnInit {
  
  @Input() frase: FraseEntrenamiento
  @Output() tipoSelected = new EventEmitter<FraseParte>() 
  tipos: string[] = []
  

  constructor (
    
    private _frase: FrasesService
  ) { }

  ngOnInit() {
  }


  setTipoFrase( parte: FraseParte,  partIndex: number ) {
      this.frase.parts[ partIndex ] = parte
      this._frase.updatePhrase( this.frase )
  }

  onParamAdded(parte: FraseParte, index: number) {
    this.frase.parts[ index ] = parte
    this._frase.updatePhrase(this.frase)
  }


  onDelPartParam( index: number ) {
    delete this.frase.parts[ index ].entityType
    this.frase.parts[ index ].selected = false
    console.log( this.frase.parts );
    this._frase.updatePhrase(this.frase)
    // var restoredPartText = this._frase.stringifyFullPhrase( this.frase )
    // var newParts = this._frase.createParts( restoredPartText )
    // console.log(newParts);
    
  }

  


}
