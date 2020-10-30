import { Component, Input, OnInit } from '@angular/core';
import { ColeccionModel, ParamExpected } from '../../collection.interface';
import { ColeccionesService } from '../../colecciones.service';

@Component({
  selector: 'aSmart-guardado-coleccion',
  templateUrl: './guardado-coleccion.component.html',
  styleUrls: ['./guardado-coleccion.component.scss']
})
export class GuardadoColeccionComponent implements OnInit {


  @Input() coleccion: ColeccionModel
  newParam: ParamExpected

  constructor (
    private _colecciones: ColeccionesService
  ) {
    this.newParam = {param:''}
  }
  
  ngOnInit(): void {
  }
  
  addParam() {
    if(!this.coleccion.saveKeys) this.coleccion.saveKeys = []
    this.coleccion.saveKeys.push( this.newParam )
    this.newParam = { param: '' }
  }

  onSave() {
    this._colecciones.updateDataColeccion(this.coleccion)
  }

}
