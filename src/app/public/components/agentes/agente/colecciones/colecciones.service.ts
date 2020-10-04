import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ColeccionModel, ColeccionDato } from './collection.interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { CacheService } from '../../../../../Gdev-Tools/cache/cache.service';
import { switchMap, startWith } from 'rxjs/operators';
import { Loading } from '../../../../../Gdev-Tools/loading/loading.service';
import { AlertService } from '../../../../../Gdev-Tools/alerts/alert.service';
import { CurrentAgenteService } from '../current-agente.service';

@Injectable({
  providedIn: 'root'
})
export class ColeccionesService {

  coleccionesList: ColeccionModel[]
  coleccionesPath: string

  constructor (
    private fs: AngularFirestore,
    private _cache: CacheService,
    private _loading: Loading,
    private _alerts: AlertService,
    private _currentAgent: CurrentAgenteService
  ) {
    this.getCollections()
  }
  
  async getCollections() {

    // await this._loading.waitForDataLoaded(
    //   this._currentAgent.agenteLoaded$
    // )
    
    this.coleccionesList = this._currentAgent.coleccionesList
    console.log( this.coleccionesList );
    this.coleccionesPath = await this._currentAgent.getPath('colecciones')
    
  }

  
  async addColeccion( coleccion ) {
    var newCol = this.coleccionesList
    .find( col => col.name == coleccion.name );
    
    if ( newCol ) {
      this._alerts.sendMessageAlert('elige otro nombre por que ese ya existe en tus colecciones')
    } else {
      newCol = { name: coleccion.name, tipo: coleccion.tipo }
      console.log(newCol);
      this.fs.collection( this._currentAgent.path + '/colecciones' ).ref
        .doc( newCol.name ).set( newCol )
      // .then(() => this.getCollections())
    }
    return 
  }


  async updateDataColeccion( coleccion: ColeccionModel ) {
    
    Object.keys( coleccion ).forEach( key => {
      if ( coleccion[ key ] == undefined ) delete coleccion[ key ] } )

    try {
      await this.fs.collection( this.coleccionesPath ).ref.doc( coleccion.name )
        .update( {...coleccion} )
      this._alerts.sendFloatNotification( 'Colección guardada' )
      return 
    } catch ( error ) {
      console.error(error);
      this._alerts.sendError('No se pudo guardar', error)
    }
  }

  async delete(colName) {
    await this.fs.collection( this.coleccionesPath ).ref.doc( colName )
    .delete()
  }
  

}
