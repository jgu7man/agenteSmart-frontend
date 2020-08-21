import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TiposService } from '../tipos.service';

@Component({
  selector: 'aSmart-tipo-selector',
  templateUrl: './tipo-selector.component.html',
  styleUrls: ['./tipo-selector.component.scss']
})
export class TipoSelectorComponent implements OnInit, OnDestroy {

  
  
  @Input() value: string
  
  tipos: string[] = []
  tipoControl = new FormControl();
  tiposFiltered: Observable<string[]>

  @Output() tipoSelected = new EventEmitter<string>()

  constructor (
    private _tipos: TiposService,
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
    var tiposList = this._tipos.tiposList ?
      this._tipos.tiposList :
      await this._tipos.get();

    tiposList.forEach( tipo => {
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
