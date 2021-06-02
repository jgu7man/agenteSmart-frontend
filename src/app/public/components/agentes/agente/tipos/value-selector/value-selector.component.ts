import { map, startWith, take } from 'rxjs/operators';
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
  @Input() set tipoDisplayName(name: string) {
    let displayName = name.startsWith('@') ? name.substring(1) : name
    this._displayName.next(displayName);
  }
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
    console.log( this.value )
    if (this.value) {
      this.valueCtrl.setValue(typeof this.value == 'string' ? this.value : '')
    }


  }



  async getClases(name: string) {
    this._cache.listenForChanges<TipoEntidadModel[]>('tipos')
      .pipe(take(1))
      .subscribe((list) => {
        const tipoFinded = list.find(t => t.displayName === name)
        this.clases = tipoFinded && 'entities' in tipoFinded ?
          tipoFinded.entities.map(e =>e.value) : []
      });
  }

  onSelected(selected: MatSelectChange) {
    this.selected.emit(selected.value);
  }

  ngOnDestroy() {
    this.nameSubscription.unsubscribe()
  }

}
