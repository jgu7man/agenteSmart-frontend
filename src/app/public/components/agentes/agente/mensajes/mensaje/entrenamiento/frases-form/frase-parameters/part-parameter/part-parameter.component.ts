import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FraseParte, ParametroMensaje } from '../../../../../mensaje.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, take } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ParametrosService } from '../../../parametros/parametros.service';
import { GdevLoading } from '../../../../../../../../../../gdev-tools/src/lib/loading/loading.service';
import { FrasesService } from '../../frases.service';
import { MensajesService } from '../../../../../mensajes.service';
import { CurrentMensajeService } from '../../../../current-mensaje.service';
import { GdevCache, GdevText } from 'src/app/gdev-tools/src/public-api';
import { MatDialog } from '@angular/material/dialog';
import { AddTipoComponent } from 'src/app/public/components/agentes/agente/tipos/add-tipo/add-tipo.component';
import { Clase, TipoEntidadModel } from 'src/app/public/components/agentes/agente/tipos/tipo.model';
import { filter } from 'lodash';
import { TiposService } from 'src/app/public/components/agentes/agente/tipos/tipos.service';

@Component({
  selector: 'aSmart-part-parameter',
  templateUrl: './part-parameter.component.html',
  styleUrls: ['./part-parameter.component.scss'],
})
export class PartParameterComponent implements OnInit {
  @Input() parte: FraseParte;
  @Input() index: number;

  switchEntitySelector: boolean = false;
  paramName: any = '';
  param: ParametroMensaje;
  entitySelected: string = ''

  toggleAddClase: boolean = false;
  disableSinonimo: boolean = false;
  synonymExists: boolean = false;

  @ViewChild('partEntityInput') partEntityInput: ElementRef;

  @Output() onDelete = new EventEmitter<any>();
  @Output() paramAdded = new EventEmitter<FraseParte>();
  @Output() tipoSelected = new EventEmitter<FraseParte>();

  constructor(
    private _params: ParametrosService,
    private _loading: GdevLoading,
    private _mensaje: CurrentMensajeService,
    public  _frases: FrasesService,
    private _text: GdevText,
    private _dialog: MatDialog,
    private _cache: GdevCache,
    private _tipos: TiposService
  ) {}

  ngOnInit(): void {
    if (this.parte)
      this.paramName = this.parte.alias == true ? '' : this.parte.alias;
  }

  async toSelectTipo() {
    this.switchEntitySelector = true;
    await this._loading.waitFor(100);
    // this.partEntityInput.nativeElement.focus()
  }

  reformatText(event: any) {
    // listen keypress event; not keydown o keyup
    var k;
    k = event.charCode; // k = event.keyCode;  (Both can be used)
    return (
      (k > 64 && k < 91) || // allow letters
      (k >= 48 && k <= 57) || // allow numbers
      (k > 96 && k < 123) || // allow numpads
      k == 8 // allow backspace
      // || k == 32  // allow space
      // || k == 188 // allow comma
      // || k == 189 // allow dash
      // || k == 190 // allow perdiod (dot)
      // || k == 95 // allow underscore
    );
  }

  onAddTipo() {
    this._dialog
      .open(AddTipoComponent, {
        minWidth: 300,
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((tipo: TipoEntidadModel) => {
        this.parte.entityType = tipo.displayName;
      });
  }

  // normalize(value: any) {
  //   console.log( value )
  //   this.paramName = this._text.normalize(value)
  // }

  onTipoSelected(tipoSelected: string) {
    this.tipoSelected.emit(this.parte);
    this.paramName = this.parte.text

    this.param = {
      displayName: tipoSelected.startsWith('@')
      ? tipoSelected.substring(1,0) : tipoSelected,
      entityTypeDisplayName: tipoSelected.startsWith('@')
        ? tipoSelected
        : '@' + tipoSelected,
      value: tipoSelected.startsWith('$')
        ? tipoSelected
        : `$${tipoSelected}`,
    };

    this.parte.entityType = tipoSelected;
    this.parte.alias = this.param.displayName;

    this.addParameter()
  }

  isSystemEntity() {
    return this.parte.entityType ? this.parte.entityType.includes('sys.') : false
  }

  addParameter() {
    this.paramAdded.emit(this.parte);
    const paramStored = this._mensaje.current$.getValue()
      .parameters.find((p) => p.displayName == this.param.displayName);

    if (!paramStored) {
      this._params.addParam(this.param)
    }
  }

  // toggleSetClase() {
  //   this.paramName =
  // }

  setClase() {
    this._tipos.putClaseOnTipo(this.param.displayName, {
      value: this.parte.text,
      synonyms: [this.parte.text]
    })
    // this.addParameter()
    // this.toggleAddClase = false
    this.disableSinonimo = true
  }

  get entityExists() {
    const tiposList = this._cache.getDataKey<TipoEntidadModel[]>('tipos')
    let entityType = this.parte.entityType.startsWith('@')
      ? this.parte.entityType.substring(1) : this.parte.entityType
    const tipoStored = tiposList.find(t => t.displayName == entityType)
    const entities = tipoStored ? tipoStored.entities : []
    let entity = entities.find(e => e.value == this.entitySelected)
    this.synonymExists = entity.synonyms.some(s => s == this.parte.text)
    return entity
  }

  get addSynonymToolTip():string {
    return this.synonymExists ? 'El sinónimo ya existe, no es necesario agregarlo de nuevo': ''
  }


  setSinonimo(entitySelected?: string) {
    this.entitySelected = entitySelected
    const synonym = this.parte.text
    var entity = this.entityExists
    if (!entity.synonyms.some(s => s === synonym)) {
      entity.synonyms.push(synonym)
      this._tipos.putClaseOnTipo(this.param.displayName, entity)
    }

  }
}
