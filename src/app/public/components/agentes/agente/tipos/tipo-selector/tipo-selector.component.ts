import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TiposService } from '../tipos.service';
import { CurrentAgenteService } from '../../current-agente.service';

@Component({
  selector: 'aSmart-tipo-selector',
  templateUrl: './tipo-selector.component.html',
  styleUrls: ['./tipo-selector.component.scss']
})
export class TipoSelectorComponent implements OnInit, OnDestroy {

  
  
  @Input() value: string
  @Input() id: any
  
  tipos: string[] = []
  tipoControl = new FormControl();
  tiposFiltered: Observable<string[]>

  @Output() tipoSelected = new EventEmitter<string>()

  constructor (
    private _tipos: TiposService,
    private _agente: CurrentAgenteService
  ) { }

  async ngOnInit() {
    if(this.value) {this.tipoControl.setValue(this.value)}
    await this.getTipos()
    this.tiposFiltered = this.tipoControl.valueChanges
      .pipe(
        startWith( '' ),
        map( value => this._filter( value ) )
      )
  }

  async getTipos() {
    this._agente.tiposList.forEach( tipo => {
      this.tipos.push( tipo.displayName )
    } )
  }

  private _filter( value: string ): string[] {
    const filterValue = value.toLowerCase()
    return this.tipos.filter( tipo => tipo.toLowerCase().includes( filterValue ) )
  }

  onTipoSelected( event: MatAutocompleteSelectedEvent ) {
    if(event.option) this.tipoSelected.emit( event.option.value )
  }

  ngOnDestroy() {
  }

}
