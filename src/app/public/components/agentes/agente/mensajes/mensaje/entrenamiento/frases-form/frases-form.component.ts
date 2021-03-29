import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, ViewEncapsulation, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { FraseEntrenamiento, FraseParte } from '../../../mensaje.model';
import { Loading } from '../../../../../../../../gdev-tools/loading/loading.service';
import { FrasesService } from './frases.service';
import { ActivatedRoute } from '@angular/router';
import { CurrentMensajeService } from '../../current-mensaje.service';
import { FraseItemComponent } from './frase-item/frase-item.component';
import { FraseParametersComponent } from './frase-parameters/frase-parameters.component';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { Subscription, Subject } from 'rxjs';
import { ParametrosService } from '../parametros/parametros.service';
import { take, mergeAll, takeLast } from 'rxjs/operators';
import { CurrentAgenteService } from '../../../../current-agente.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import {reverse} from 'lodash';

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
    // paginatiorLabes: MatPaginatorIntl = new MatPaginatorIntl
    currentPage: any[]
    pageSize: number = 10
    firstIndex: number = 0
    lastIndex: number
    listenerParamDeleted: Subscription
    mensajeSub: Subscription
    paramAddedSub: Subscription

    @ViewChild( 'newPhraseInput' ) newPhraseInput: ElementRef
    @ViewChild('frasesList') frasesList: MatAccordion
  @ViewChildren( FraseItemComponent ) prhaseList: QueryList<FraseItemComponent>
  @ViewChildren( FraseParametersComponent ) parametersList: QueryList<FraseParametersComponent>


  constructor (
    private loading: Loading,
    public frases: FrasesService,
    public mensaje: CurrentMensajeService,
      private _params: ParametrosService,
    private _paginator: MatPaginatorIntl
  ) {

        this._paginator.itemsPerPageLabel = 'Frases por página'
        this._paginator.firstPageLabel = "Primera página"
        this._paginator.lastPageLabel = "Última página"
        this._paginator.nextPageLabel = "Siguiente"
      this._paginator.previousPageLabel = "Anterior"

   }

    ngOnInit(): void {
        this.mensajeSub =
        this.mensaje.current$.subscribe(mensaje => {
            if (mensaje) {
                let frases = mensaje.trainingPhrases
                this.currentPage = frases.slice(this.firstIndex, this.pageSize)
                this.getLastIndex(
                    this.currentPage.length - this.pageSize,
                    this.currentPage.length)
            }
        })


    }

    getLastIndex(startIndex: number, length: number) {
        if (this.pageSize > length) {
            this.lastIndex = length
        } else {
            this.lastIndex = startIndex + this.pageSize
        }
    }

    pageEvent(event: PageEvent) {
        let lastDiff = this.Frases.length - (event.pageIndex * this.pageSize)
        let firstDiff = lastDiff - this.pageSize
            firstDiff = firstDiff <= 0 ? 0 : firstDiff
        this.currentPage = this.Frases.slice(firstDiff, lastDiff)
        console.log(firstDiff, lastDiff)

        this.firstIndex = event.pageIndex * this.pageSize + 1
        this.getLastIndex(this.firstIndex, this.currentPage.length)
        console.log(this.firstIndex, this.lastIndex)
    }

    ngAfterViewInit() {
        this.paramAddedSub =
            this.frases.paramAdded$.subscribe(() => {
                this.frasesList.closeAll()
        })
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
    this.newPhraseInput.nativeElement.focus()
  }


  async onSetPhrase() {
      this.addPhraseInput = false
      this.fraseExpanded = undefined
    if ( this.newPhrase ) {

      // console.log(this.newPhrase);
      const NEWPHRASE: FraseEntrenamiento = {
        type: 'EXAMPLE',
        parts: this.frases.createParts( this.newPhrase )
      }
      await this.loading.waitFor( 200 )
        this.frases.addTraningPhrase(NEWPHRASE, this.lastIndex)
            .then(async () => {
                this.currentPage.push(NEWPHRASE, 0)
                this.currentPage.splice(this.currentPage.length-1, 1)
                this.newPhrase = ''
                await this.loading.waitFor(500)
                this.frasesList.closeAll()
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
    //   console.log(textSelected, frase);
      var fraseRestructured: FraseEntrenamiento =
      // Find the part that includes text selected and split it
      await this.frases.stractSelectedPart(frase, textSelected)
    //   console.log( fraseRestructured);


      this.frases.updatePhrase(fraseRestructured, index)

      this.fraseExpanded = index
      // console.log(this.fraseExpanded);

    }
  }




  disableFrase( frase: FraseEntrenamiento ) {
      let someEntity: boolean = false;
      frase.parts.forEach(parte => {
          if (parte && (parte.entityType || parte.alias)) someEntity = true
      });
      return someEntity ? false : true
  }


  trackByFraseName( index, frase: FraseEntrenamiento ) {
    return frase.name
  }


  ngOnDestroy() {
    // this.listenerParamDeleted.unsubscribe()
      this.paramAddedSub.unsubscribe()
      this.mensajeSub.unsubscribe()
  }


}
