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
import { iEntity, iEntityType, TipoEntidadModel } from 'src/app/public/components/agentes/agente/tipos/tipo.model';
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

  toggleAddClase: boolean = false;
  disableSinonimo: boolean = false;
  synonymExists: boolean = false;

  entitySelected: iEntity

  @ViewChild('partEntityInput') partEntityInput: ElementRef;

  @Output() onDelete = new EventEmitter<any>();
  @Output() paramAdded = new EventEmitter<FraseParte>();
  @Output() onTipoChange = new EventEmitter<FraseParte>();

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
    if (this.parte) {
      this.paramName = this.parte.alias == true ? '' : this.parte.alias;
    }
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

  get tipoSelected() {
    const tiposList = this._cache.getDataKey<TipoEntidadModel[]>('tipos')
    let entityType = this.parte.entityType.startsWith('@')
      ? this.parte.entityType.substring(1) : this.parte.entityType
    return tiposList.find(t => t.displayName == entityType)
  }


  onTipoSelected(tipoSelected: string) {
    this.parte.entityType = tipoSelected.startsWith('@')
      ? tipoSelected : `@${tipoSelected}`
    if (tipoSelected === 'productos') {
      this.parte.alias = this.paramName = 'productos'
    } else {
      this.paramName = this.parte.text
    }

    this.addParameter()
    // this.tipoSelected.emit(this.parte);
  }

  get isSystemEntity() {
    return this.parte.entityType
      ? this.parte.entityType.includes('sys.')
      || this.parte.entityType.includes('productos')
      : false
  }

  addParameter() {
    this.param = {
      displayName: this.parte.entityType.substring(1),
      entityTypeDisplayName: this.parte.entityType,
      value: typeof this.parte.alias == 'string' ?
        this.parte.alias.startsWith('$')
          ? this.parte.alias
          : `$${this.parte.alias}`
        : this.parte.entityType.substring(1)
    };
    // console.log( this.parte )
    this.paramAdded.emit(this.parte);
    const paramStored = this._mensaje.current$.getValue()
      .parameters.find((p) => p.displayName == this.param.displayName);

    // console.log( paramStored )
    if (!paramStored) {
      this._params.addParam(this.param)
    }
  }

  setNewEntity() {
    this._tipos.putClaseOnTipo(this.param.displayName, {
      value: this.parte.text,
      synonyms: [this.parte.text]
    })
    this.disableSinonimo = true
  }

  get entitySelected$() {
    const entities = this.tipoSelected ? this.tipoSelected.entities : []
    return entities.find(e => e.value == this.parte.alias )
  }

  onEntitySelect(entitySelected: string) {
    this.parte.alias = entitySelected;
    this.synonymExists = this.entitySelected$.synonyms.some(
      s => s.toLowerCase() == this.parte.text.toLowerCase()
    )

    this.addParameter()
    return this.entitySelected
  }

  get addSynonymToolTip():string {
    return this.synonymExists ? 'El sinónimo ya existe, no es necesario agregarlo de nuevo': ''
  }

  setCustomParam(value:string) {
    this.parte.alias = this.param.displayName = value
  }

  setSinonimo() {
    const synonym = this.parte.text
    if (!this.entitySelected.synonyms.some(s => s === synonym)) {
      this.entitySelected.synonyms.push(synonym)
      console.log( this.entitySelected )
      this._tipos.putClaseOnTipo(this.parte.entityType, this.entitySelected)
      .then(() => this.disableSinonimo = true)
    }

  }
}
