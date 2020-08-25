import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { FraseEntrenamiento, FraseParte } from '../../../entrada.model';
import { Loading } from '../../../../../../../../global/loading/loading.service';
import { FrasesService } from './frases.service';
import { ActivatedRoute } from '@angular/router';
import { CurrentEntradaService } from '../../current-entrada.service';
import { FraseItemComponent } from './frase-item/frase-item.component';
import { FraseParametersComponent } from './frase-parameters/frase-parameters.component';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Subscription } from 'rxjs';
import { ParametrosService } from '../parametros/parametros.service';

@Component({
  selector: 'aSmart-frases-form',
  templateUrl: './frases-form.component.html',
  styleUrls: [ './frases-form.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class FrasesFormComponent implements OnInit, AfterViewInit, OnDestroy {

  
  addPhraseInput: boolean = false
  frases: FraseEntrenamiento[]
  newPhrase: string
  phraseParts: FraseParte[] = []
  fraseExpanded: string

  listenerParamDeleted: Subscription
  
  @ViewChild( 'newPhraseInput' ) newPhraseInput: ElementRef
  @ViewChildren( FraseItemComponent ) prhaseList: QueryList<FraseItemComponent>
  @ViewChildren( FraseParametersComponent ) parametersList: QueryList<FraseParametersComponent>


  constructor (
    private loading: Loading,
    private _frases: FrasesService,
    private _route: ActivatedRoute,
    private _entradas: CurrentEntradaService,
    private _params: ParametrosService
  ) { }

  ngOnInit(): void {
    this.getFrasesEntrenamiento()
    this.listenerParamDeleted = this._params.parameterDeleted$
    .subscribe(()=>{this.getFrasesEntrenamiento()})
  }

  ngAfterViewInit() {
  }

  
  // CREATE frase
  async toAddPhrase() {
    this.addPhraseInput = true
    await this.loading.waitFor( 100 )
    this.newPhraseInput.nativeElement.focus()
  }


  onSetPhrase() {
    this.addPhraseInput = false
    if ( this.newPhrase ) {

      const NEWPHRASE: FraseEntrenamiento = {
        type: 'EXAMPLE',
        parts: this._frases.createParts( this.newPhrase )
      }
      console.log( NEWPHRASE );
      this.loading.waitFor( 200 )
      this._frases.addTraningPhrase( NEWPHRASE ).then( () => {
        this.getFrasesEntrenamiento()
      } )
    }
  }
  

  // READ Frase
  async getFrasesEntrenamiento() {
    this.frases = await this._frases.get()
  }

  

  // UPDATE FRASE
  async toEditPhrase( phrase: FraseEntrenamiento ) {
    const phraseEdit = this.prhaseList.find(frase => frase.phraseName == phrase.name)
    phraseEdit.toEditPhrase(phrase)
  }


  async onSelect( frase: FraseEntrenamiento ) {
    const textSelected = window.getSelection().toString()
    

    if ( textSelected ) {
      // Select the frase that whas select on
      const fraseOnEdit = this.frases.find( Frase => Frase.name == frase.name )
      const fraseOnEditIndex = this.frases.findIndex( Frase => Frase.name == frase.name )

      // Define variables
      var fraseRestructured: FraseEntrenamiento = 
      // Find the part that includes text selected and split it
      await this._frases.stractSelectedPart(frase, textSelected)
      console.log( fraseRestructured);
      
      
      // Merge the parts
      this.frases[ fraseOnEditIndex ] = fraseRestructured
      
      this.fraseExpanded = frase.name
      const phraseItemEdited = this.prhaseList.find( Frase => Frase.phraseName == frase.name )
      phraseItemEdited.frase.parts = fraseRestructured.parts
    }
  }


  disableFrase( frase: FraseEntrenamiento ) {
    let someEntity: boolean = false
    frase.parts.forEach( parte => {
      if (parte.entityType || parte.selected) someEntity = true
    } )
    if ( someEntity ) return false
    else return true
  }


  trackByFraseName( index, frase: FraseEntrenamiento ) {
    return frase.name
  }

  
  ngOnDestroy() {
    this.listenerParamDeleted.unsubscribe()
  }
  

}
