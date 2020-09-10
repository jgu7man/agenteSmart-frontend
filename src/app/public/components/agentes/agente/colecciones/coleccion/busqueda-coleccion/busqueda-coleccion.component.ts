import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ColeccionDato, ColeccionModel } from '../../collection.interface';
import { MatSelectionList } from '@angular/material/list';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AlertService } from '../../../../../../../Gdev-Tools/alerts/alert.service';
import { ColeccionesService } from '../../colecciones.service';
import { Loading } from '../../../../../../../Gdev-Tools/loading/loading.service';

@Component({
  selector: 'aSmart-busqueda-coleccion',
  templateUrl: './busqueda-coleccion.component.html',
  styleUrls: ['./busqueda-coleccion.component.scss']
})
export class BusquedaColeccionComponent implements OnInit {


  @Input() coleccion: ColeccionModel
  /**
   * Lista de datos en vista
   * @type {MatSelectionList}
   */
  @ViewChild( 'datosList' ) datosList: MatSelectionList
  /**
   * Envía la lista de datos editada
   * @type {EventEmitter<any>}
   */
  @Output() datosListEdited: EventEmitter<any> = new EventEmitter()

  /** Propiedad que se actualiza cada selección de item de la lista */
  public allSelected: boolean
  /** Cantidad de datos seleccionados */
  public datosSelected: number
  /** Cantidad de datos */
  public datosInList: number
  /** Lista de valores de datos seleccionados */
  public datosSelectedList: ColeccionDato[] = []
  /** Modelo de dato nuevo */
  public newColeccionDato: ColeccionDato = {
    identificador: '', valor: ''
  }


  constructor (
    private _alerta: AlertService,
    private _colecciones: ColeccionesService,
    private loading: Loading
  ) { }

  ngOnInit(): void {
    console.log(this.coleccion);
  }

  /**
   * Agregar dato
   *
   * @memberof BusquedaColeccionComponent
   */
  addDato() {
    let newDato
    
    if ( this.coleccion.queryData ) {
      newDato = this.coleccion.queryData.find(
        dato => dato.identificador == this.newColeccionDato.identificador );
    }

    if ( newDato ) {
      this._alerta.sendMessageAlert( 'Ese identificador ya existe. Cada identificador debe ser diferente' )
    } else {
      if ( !this.coleccion.queryData ) { this.coleccion.queryData = [] }
      this.coleccion.queryData.push( this.newColeccionDato )
      this._colecciones.updateDataColeccion( this.coleccion )
        .then( () => { this.newColeccionDato = { identificador: '', valor: '' }})
    }
  }


  
  public onSelectedChange( ) {
    this.datosSelected = this.datosList.selectedOptions.selected.length
    this.datosInList = this.coleccion.queryData.length

    this.datosSelectedList = []
    this.datosList.selectedOptions.selected.forEach( dato => {
      this.datosSelectedList.push( dato.value )
    } )
    this.allSelected = this.datosInList == this.datosSelected ? true : false
  }

  

  public onSelectAll( event: MatCheckboxChange ) {
    this.datosSelected = this.datosList.selectedOptions.selected.length
    this.datosInList = this.coleccion.queryData.length

    if ( event.checked ) {
      if ( this.datosSelected < this.datosInList ) {
        this.datosList.selectAll()
        this.datosList.selectedOptions.selected.forEach( dato => {
          this.datosSelectedList.push( dato.value )
        } )
      } else {
        this.datosList.deselectAll()
      }
    } else {
      this.datosList.deselectAll()
    }
  }





  async onDeleteDatos() {
    console.log( this.coleccion.queryData );
    console.log(this.datosSelectedList);
    await this.loading.asyncForEach( this.datosSelectedList,
      dato => {
        console.log( this.coleccion.queryData);
        let datoToDel = this.coleccion.queryData
          .findIndex( d => d.identificador == dato.identificador )
        console.log(datoToDel);
        this.coleccion.queryData.splice( datoToDel, 1 )
        console.log(this.coleccion.queryData);
        return
      }
    );

    this._colecciones.updateDataColeccion( this.coleccion )
      .then( () => {
        this.newColeccionDato = { identificador: '', valor: '' }
        this.allSelected = false
      } )
      
  }

  onEdit(dato: ColeccionDato) {
    this.newColeccionDato = dato
    let datoToDel = this.coleccion.queryData
      .findIndex( d => d.identificador == dato.identificador )
    if ( datoToDel > -1 ) {
      this.coleccion.queryData.splice( datoToDel, 1 )
    }
  }




  deleteOneDato( dato: ColeccionDato ) {
    let datoToDel = this.coleccion.queryData
      .findIndex( d => d.identificador == dato.identificador )
    if ( datoToDel > -1 ) {
      this.coleccion.queryData.splice( datoToDel, 1 )
    }
    this._colecciones.updateDataColeccion( this.coleccion )
      .then( () => { this.newColeccionDato = { identificador: '', valor: '' } } )
  }

}
