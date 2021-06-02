import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, retryWhen, tap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TiposService } from '../tipos.service';
import { CurrentAgenteService } from '../../current-agente.service';
import { GdevCache } from '../../../../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { SystemEntitieModel, TipoEntidadModel } from '../tipo.model';
import { GdevLoading } from 'src/app/gdev-tools/src/public-api';

@Component({
  selector: 'aSmart-tipo-selector',
  templateUrl: './tipo-selector.component.html',
  styleUrls: ['./tipo-selector.component.scss'],
})
export class TipoSelectorComponent implements OnInit, OnDestroy {
  @Input() value: string;
  @Input() id: any;

  tipos: string[] = [];
  tipoControl = new FormControl();
  tiposFiltered: Observable<string[]>;

  @Output() tipoSelected = new EventEmitter<string>();

  constructor(
    private _tipos: TiposService,
    private _loading: GdevLoading,
    private _cache: GdevCache
  ) {}

  async ngOnInit() {
    // si el selector tiene valor
    if (this.value) {
      this.tipoControl.setValue(this.value);
    }
    // NOTE Hacer que esto espere la carga de todo
    await this.getTipo();
    this.tiposFiltered = this.tipoControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value)),
    );
  }

  async getTipo() {
    if (!this._tipos.list$) {
      this._tipos.list$ = this._cache.listenForChanges<TipoEntidadModel[]>('tipos')
    }
      await this._loading.waitFor(2000)
      this._tipos.list$.pipe(
        startWith([]),
        map<any[], any[]>(list => list ? list.map(t => t.displayName) : []),
      ).subscribe((list) => { this.tipos = list });
      // this._tipos.getTiposList();
  }

  private _filter(value: string): string[] {
    if (value === '@' || value.includes('sys')) {
      let sys = this._cache.getDataKey<SystemEntitieModel[]>('sysTipos')
        .map(e => e.displayName)
      this.tipos = this.tipos.concat(sys)
    }
    const filterValue = value.toLowerCase();
    return this.tipos.filter((tipo) =>
      tipo.toLowerCase().includes(filterValue)
    );
  }

  onTipoSelected(event: MatAutocompleteSelectedEvent) {
    // console.log( event.option.value )
    if (event.option) this.tipoSelected.emit(event.option.value);
  }




  ngOnDestroy() {}
}
