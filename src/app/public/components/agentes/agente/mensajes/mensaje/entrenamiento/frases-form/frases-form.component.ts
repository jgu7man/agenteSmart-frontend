import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
  ViewEncapsulation,
  AfterViewInit,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import { FraseEntrenamiento, FraseParte } from '../../../mensaje.model';
import { GdevLoading } from '../../../../../../../../gdev-tools/src/lib/loading/loading.service';
import { FrasesService } from './frases.service';
import { ActivatedRoute } from '@angular/router';
import { CurrentMensajeService } from '../../current-mensaje.service';
import { FraseItemComponent } from './frase-item/frase-item.component';
import { FraseParametersComponent } from './frase-parameters/frase-parameters.component';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { Subscription, Subject } from 'rxjs';
import { ParametrosService } from '../parametros/parametros.service';
import { take, mergeAll, takeLast } from 'rxjs/operators';
import { CurrentAgenteService } from '../../../../current-agente.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { reverse } from 'lodash';

@Component({
  selector: 'aSmart-frases-form',
  templateUrl: './frases-form.component.html',
  styleUrls: ['./frases-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FrasesFormComponent implements OnInit, AfterViewInit, OnDestroy {
  addPhraseInput: boolean = false;
  newPhrase: string;
  phraseParts: FraseParte[] = [];
  fraseExpanded?: number;
  // paginatiorLabes: MatPaginatorIntl = new MatPaginatorIntl
  currentPage: any[];
  pageSize: number = 10;
  firstIndex: number = 0;
  lastIndex: number;
  listenerParamDeleted: Subscription;
  frasesSub: Subscription;
  paramAddedSub: Subscription;
  frasesList: FraseEntrenamiento[] = []

  @ViewChild('newPhraseInput') newPhraseInput: ElementRef;
  @ViewChild('accordeon') accordeon: MatAccordion;
  @ViewChildren('frase') frasePanels: QueryList<MatExpansionPanel>;
  @ViewChildren(FraseItemComponent) prhaseList: QueryList<FraseItemComponent>;
  @ViewChildren(FraseParametersComponent) parametersList: QueryList<
    FraseParametersComponent
  >;

  constructor(
    private _loading: GdevLoading,
    public $frases: FrasesService,
    public $mensaje: CurrentMensajeService,
    private _params: ParametrosService,
    private _paginator: MatPaginatorIntl,
  ) {
    this._paginator.itemsPerPageLabel = 'Frases por página';
    this._paginator.firstPageLabel = 'Primera página';
    this._paginator.lastPageLabel = 'Última página';
    this._paginator.nextPageLabel = 'Siguiente';
    this._paginator.previousPageLabel = 'Anterior';
  }

  ngOnInit(): void {
    this.frasesSub = this.$frases.list$.subscribe((frases) => {
      this.frasesList = frases
        this.firstIndex = (frases.length-1)- this.pageSize
        this.currentPage = frases.slice(this.firstIndex, this.pageSize)
        this.getLastIndex(
          this.currentPage.length - this.pageSize,
          this.currentPage.length
        );
    });
  }

  getLastIndex(startIndex: number, length: number) {
    if (this.pageSize > length) {
      this.lastIndex = length;
    } else {
      this.lastIndex = startIndex + this.pageSize;
    }
  }

  pageEvent(event: PageEvent) {
    let lastDiff = this.frasesList.length - (event.pageIndex * this.pageSize);
    let firstDiff = lastDiff - this.pageSize;
    firstDiff = firstDiff <= 0 ? 0 : firstDiff;
    this.currentPage = this.frasesList.slice(firstDiff, lastDiff);
    console.log(firstDiff, lastDiff);

    this.firstIndex = event.pageIndex * this.pageSize + 1;
    this.getLastIndex(this.firstIndex, this.currentPage.length);
    console.log(this.firstIndex, this.lastIndex);
  }

  ngAfterViewInit() {
    this.paramAddedSub = this.$frases.paramAdded$.subscribe(() => {
      this.accordeon.closeAll();
    });

  }

  // get Frases() {
  //   const mensaje = this.$mensaje.current$.getValue();
  //   console.log( mensaje )
  //   return mensaje ? mensaje.trainingPhrases : [];
  // }

  // CREATE frase
  async toAddPhrase() {
    this.addPhraseInput = true;
    await this._loading.waitFor(200);
    this.newPhraseInput.nativeElement.focus();
  }

  async onSetPhrase() {
    this.addPhraseInput = false;
    this.fraseExpanded = undefined;
    if (this.newPhrase) {
      // console.log(this.newPhrase);
      const NEWPHRASE: FraseEntrenamiento = {
        type: 'EXAMPLE',
        parts: this.$frases.createParts(this.newPhrase),
      };
      await this._loading.waitFor(200);
      this.$frases.addTraningPhrase(NEWPHRASE, this.lastIndex)
        .then(async () => {
          console.log( this.currentPage.length == this.pageSize )
        if (this.currentPage.length == this.pageSize) {
          this.currentPage.push(NEWPHRASE, 0);
          console.log( this.currentPage[0] )
          this.currentPage.splice(this.currentPage.length - 1, 1);
          console.log( this.currentPage[this.currentPage.length - 1] )
        }
        this.newPhrase = '';
        await this._loading.waitFor(500);
        this.accordeon.closeAll();
      });
    }
  }

  // UPDATE FRASE

  /** Obtiene el valor seleccionado al momento de soltar el mouse en la frase de entrenamiento y la transforma en "partes" */
  async onSelect(frase: FraseEntrenamiento, index: number) {
    const textSelected = window.getSelection().toString();
    if (textSelected) {
      // Define variables
      //   console.log(textSelected, frase);
      var fraseRestructured: FraseEntrenamiento =
      // Find the part that includes text selected and split it
      await this.$frases.stractSelectedPart(frase, textSelected);
      console.log( fraseRestructured);

      this.$frases.updatePhrase(fraseRestructured);
      await this._loading.waitFor(100)
      this.fraseExpanded = index
      // console.log(this.currentPage[this.fraseExpanded])
    }
  }

  validateFraseExpanded(index) {
    if (this.fraseExpanded >= 0) {
      return index == this.fraseExpanded
    }

  }

  openedPanel(event) {
    console.log( event )
  }

  onRemoveFrase(index: number) {
    this.currentPage.splice(index, 1);
  }

  disableFrase(frase: FraseEntrenamiento) {
    let someEntity: boolean = false;
    frase.parts.forEach((parte) => {
      if (parte && (parte.entityType || parte.alias)) someEntity = true;
    });
    return someEntity ? false : true;
  }

  trackByFraseName(index, frase: FraseEntrenamiento) {
    return frase.name;
  }

  ngOnDestroy() {
    // this.listenerParamDeleted.unsubscribe()
    this.paramAddedSub.unsubscribe();
    this.frasesSub.unsubscribe();
  }
}
