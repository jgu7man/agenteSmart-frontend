import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { TiposService } from '../../../../../tipos/tipos.service';
import { FraseParte } from '../../../../entrada.model';

@Component({
  selector: 'aSmart-frase-parameters',
  templateUrl: './frase-parameters.component.html',
  styleUrls: ['./frase-parameters.component.scss']
})
export class FraseParametersComponent implements OnInit {

  entityControl = new FormControl();
  paramName: string = ''
  tipos: string[] = []
  tiposFiltered: Observable<string[]>

  @Input() parte: FraseParte
  @Input() parteIndex: string

  constructor (
    private _tipos: TiposService
  ) { }

  async ngOnInit() {
    await this.getTipos()
    this.tiposFiltered = this.entityControl.valueChanges
      .pipe(
        startWith( '' ),
        map(value => this._filter(value))
      )
  }
  
  async getTipos() {
    var tiposList = this._tipos.tiposList ?
      this._tipos.tiposList :
      await this._tipos.get();
    
    tiposList.forEach( tipo => {
      this.tipos.push(tipo.displayName)
    } )
    console.log(this.tipos);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase()
    return this.tipos.filter(tipo => tipo.toLowerCase().includes(filterValue))
  }


}
