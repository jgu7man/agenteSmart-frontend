import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, ViewEncapsulation, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { FraseEntrenamiento, FraseParte } from '../../../mensaje.model';
import { Loading } from '../../../../../../../../Gdev-Tools/loading/loading.service';
import { FrasesService } from './frases.service';
import { ActivatedRoute } from '@angular/router';
import { CurrentMensajeService } from '../../current-mensaje.service';
import { FraseItemComponent } from './frase-item/frase-item.component';
import { FraseParametersComponent } from './frase-parameters/frase-parameters.component';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Subscription, from } from 'rxjs';
import { ParametrosService } from '../parametros/parametros.service';
import { take, mergeAll, takeLast } from 'rxjs/operators';
import { CurrentAgenteService } from '../../../../current-agente.service';

@Component({
  selector: 'aSmart-frases-form',
  templateUrl: './frases-form.component.html',
  styleUrls: [ './frases-form.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class FrasesFormComponent implements OnInit, AfterViewInit, OnDestroy {

  
  addPhraseInput: boolean = false
  newPhrase: string
  phraseParts: FraseParte[] = []
  fraseExpanded: number

  listenerParamDeleted: Subscription
  
  @ViewChild( 'newPhraseInput' ) newPhraseInput: ElementRef
  @ViewChildren( FraseItemComponent ) prhaseList: QueryList<FraseItemComponent>
  @ViewChildren( FraseParametersComponent ) parametersList: QueryList<FraseParametersComponent>


  constructor (
    private loading: Loading,
    public frases: FrasesService,
    public mensaje: CurrentMensajeService,
    private _params: ParametrosService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  

  get Frases() {
    if (this.mensaje.current) {
      // console.log(this.mensaje.current.trainingPhrases);
      return this.mensaje.current.trainingPhrases
    } else {
      return []
    }
  }

  
  // CREATE frase
  async toAddPhrase() {
    this.addPhraseInput = true
    await this.loading.waitFor( 200 )
    // this.newPhraseInput.nativeElement.focus()
  }


  onSetPhrase() {
    this.addPhraseInput = false
    if ( this.newPhrase ) {
      
      // console.log(this.newPhrase);
      const NEWPHRASE: FraseEntrenamiento = {
        type: 'EXAMPLE',
        parts: this.frases.createParts( this.newPhrase )
      }
      this.loading.waitFor( 200 )
      this.frases.addTraningPhrase( NEWPHRASE ).then( () => {
        this.newPhrase = ''
      })
    }
  }
  

  

  

  // UPDATE FRASE
  
  /** Obtiene el valor seleccionado al momento de soltar el mouse en la frase de entrenamiento y la transforma en "partes" */
  async onSelect(frase: FraseEntrenamiento, index: number) {
    // console.log(frase.parts[1], index);
    const textSelected = window.getSelection().toString()
    
    if ( textSelected ) {
      // Define variables
      console.log(textSelected, frase);
      var fraseRestructured: FraseEntrenamiento = 
      // Find the part that includes text selected and split it
      await this.frases.stractSelectedPart(frase, textSelected)
      console.log( fraseRestructured);
      
      
      this.frases.updatePhrase(fraseRestructured, index)
      
      this.fraseExpanded = index
      // console.log(this.fraseExpanded);
      
    }
  }


  disableFrase( frase: FraseEntrenamiento ) {
    let someEntity: boolean = false
    frase.parts.forEach( parte => {
      if (parte.entityType || parte.alias) someEntity = true
    })
    return someEntity ? false : true
    
  }


  trackByFraseName( index, frase: FraseEntrenamiento ) {
    return frase.name
  }

  
  ngOnDestroy() {
    // this.listenerParamDeleted.unsubscribe()
  }
  

}
