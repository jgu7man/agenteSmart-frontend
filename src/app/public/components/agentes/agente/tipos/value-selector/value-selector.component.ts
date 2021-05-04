import { map, startWith } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GdevCache } from 'src/app/gdev-tools/src/public-api';
import { TiposService } from '../tipos.service';
import { TipoEntidadModel } from '../tipo.model';
import { MatSelectionListChange } from '@angular/material/list';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'aSmart-value-selector',
  templateUrl: './value-selector.component.html',
  styleUrls: ['./value-selector.component.scss']
})
export class ValueSelectorComponent implements OnInit, OnDestroy {

  valueCtrl: FormControl = new FormControl('')
  clases: string[] = [];
  // @Input() tipoDisplayName: string;
  private _displayName : BehaviorSubject<string> = new BehaviorSubject('');
  @Input() set tipoDisplayName(name: string) { this._displayName.next(name); }
  get tipoDisplayName() { return this._displayName.getValue()}

  @Input() value: string
  @Output() selected: EventEmitter<string> = new EventEmitter();
  nameSubscription: Subscription

  constructor(
    private _cache: GdevCache,
    private _tipos: TiposService
  ) {
    this.nameSubscription =
      this._displayName.subscribe((name: string) => {
        if (name) {
          name = name.startsWith('@') ? name.split('@')[1] : name
          this.getClases(name);
        }
      })
  }

  async ngOnInit() {
    if (this.value) {
      this.valueCtrl.setValue(this.value)
    }


  }



  async getClases(name: string) {
    if (!this._tipos.list$) {
      this._tipos.list$ = this._cache.listenForChanges<TipoEntidadModel[]>('tipos')
    }

      this._tipos.list$.pipe(
        map<TipoEntidadModel[], string[]>(list => {
          const tipoFinded = list.find(t => t.displayName === name)

          return tipoFinded && tipoFinded.entities ?
            tipoFinded.entities.map(e =>e.value) : []
        }),
      ).subscribe((list) => {
        this.clases = list
      });
      // this._tipos.getTiposList();
  }

  onSelected(selected: MatSelectChange) {
    this.selected.emit(selected.value);
  }

  ngOnDestroy() {
    this.nameSubscription.unsubscribe()
  }

}
