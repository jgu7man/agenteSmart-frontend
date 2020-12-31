import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ColeccionModel } from '../../collection.interface';
import { MatSelectionList } from '@angular/material/list';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ColeccionesService } from '../../colecciones.service';
import { MatDrawer } from '@angular/material/sidenav';
import { AlertService } from '../../../../../gdev-tools/alerts/alert.service';
import { Loading } from '../../../../../gdev-tools/loading/loading.service';
import { CacheService } from '../../../../../gdev-tools/cache/cache.service';
import { UserInterface } from '../../../../../admin/auth/auth.service';

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
  @ViewChild('busquedaItem') itemPanel: MatDrawer
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
  // public datosSelectedList: ColeccionDato[] = []
  /** Modelo de dato nuevo */
  // public newColeccionDato: ColeccionDato = {
  //   identificador: '', body: '', titulo: '',
  //   imagenURL: '', enlace: ''
  // }
  user: UserInterface


  constructor (
    private _alerta: AlertService,
    private _colecciones: ColeccionesService,
    private loading: Loading,
    private _cache: CacheService
  ) { }

  async ngOnInit() {
    this.user = this._cache.getDataKey('user')
  }

  /**
   * Agregar dato
   */
  addDato() {
    // let newDato
    
    // if ( this.coleccion.queryData ) {
    //   newDato = this.coleccion.queryData.find(
    //     dato => dato.identificador == this.newColeccionDato.identificador );
    // }

    // if ( newDato ) {
    //   this._alerta.sendMessageAlert( 'Ese identificador ya existe. Cada identificador debe ser diferente' )
    // } else {
    //   if ( !this.coleccion.queryData ) { this.coleccion.queryData = [] }
    //   this.coleccion.queryData.push( this.newColeccionDato )
    //   this._colecciones.updateDataColeccion( this.coleccion )
    //     .then( () => { this.newColeccionDato = { identificador: '', body: '' }})
    // }
  }

  openEditPanel( dato ) {
    // console.log(dato);
    // this.newColeccionDato = {
    //   identificador: dato.identificador ? dato.identificador : '',
    //   body: dato.body ? dato.body : '',
    //   titulo: dato.titulo ? dato.titulo : '',
    //   imagenURL: dato.imagenURL ? dato.imagenURL : '',
    //   enlace: dato.enlace ? dato.enlace : '',
    // }
    // this.itemPanel.open()
    // console.log( this.newColeccionDato);
  }

  updateDato( body ) {
    // // try {

    // //   var dato = this.coleccion.queryData.findIndex(
    // //     d => d.identificador == body.identificador
    // //   )

    // //   if ( dato >= 0 ) {
    // //     this.coleccion.queryData[ dato ] = body
    // //     console.log(this.coleccion);
    // //     this._colecciones.updateDataColeccion( this.coleccion )
    // //       .then( () => {
    // //         this.newColeccionDato = {
    // //           identificador: '', body: '', titulo: '',
    // //           imagenURL: '', enlace: ''
    // //         }
    // //       } )
    // //       .then(() => this._alerta.sendFloatNotification('Guardado', 'ok'))
    // //   }

    // //   this.itemPanel.close()
    // // } catch (error) {
    // //   this._alerta.sendError('Algo salió mal', error)
    // }
  }


  
  public onSelectedChange( ) {
    // this.datosSelected = this.datosList.selectedOptions.selected.length
    // this.datosInList = this.coleccion.queryData.length

    // this.datosSelectedList = []
    // this.datosList.selectedOptions.selected.forEach( dato => {
    //   this.datosSelectedList.push( dato.value )
    // } )
    // this.allSelected = this.datosInList == this.datosSelected ? true : false
  }

  

  public onSelectAll( event: MatCheckboxChange ) {
    // this.datosSelected = this.datosList.selectedOptions.selected.length
    // this.datosInList = this.coleccion.queryData.length

    // if ( event.checked ) {
    //   if ( this.datosSelected < this.datosInList ) {
    //     this.datosList.selectAll()
    //     this.datosList.selectedOptions.selected.forEach( dato => {
    //       this.datosSelectedList.push( dato.value )
    //     } )
    //   } else {
    //     this.datosList.deselectAll()
    //   }
    // } else {
    //   this.datosList.deselectAll()
    // }
  }





  async onDeleteDatos() {
    // console.log( this.coleccion.queryData );
    // console.log(this.datosSelectedList);
    // await this.loading.asyncForEach( this.datosSelectedList,
    //   dato => {
    //     console.log( this.coleccion.queryData);
    //     let datoToDel = this.coleccion.queryData
    //       .findIndex( d => d.identificador == dato.identificador )
    //     console.log(datoToDel);
    //     this.coleccion.queryData.splice( datoToDel, 1 )
    //     console.log(this.coleccion.queryData);
    //     return
    //   }
    // );

    // this._colecciones.updateDataColeccion( this.coleccion )
    //   .then( () => {
    //     this.newColeccionDato = {
    //       identificador: '', body: '', titulo: '',
    //       imagenURL: '', enlace: '' }
    //     this.allSelected = false
    //   } )
      
  }

  onEdit(dato) {
    // this.newColeccionDato = dato
    // let datoToDel = this.coleccion.queryData
    //   .findIndex( d => d.identificador == dato.identificador )
    // if ( datoToDel > -1 ) {
    //   this.coleccion.queryData.splice( datoToDel, 1 )
    // }
  }




  deleteOneDato( dato ) {
    // let datoToDel = this.coleccion.queryData
    //   .findIndex( d => d.identificador == dato.identificador )
    // if ( datoToDel > -1 ) {
    //   this.coleccion.queryData.splice( datoToDel, 1 )
    // }
    // this._colecciones.updateDataColeccion( this.coleccion )
    //   .then( () => {
    //     this.newColeccionDato = {
    //       identificador: '', body: '', titulo: '',
    //       imagenURL: '', enlace: '' } } )
  }


  saveBusquedaItem(itemId) {
    
  }

}
