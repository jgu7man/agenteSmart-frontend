import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ColeccionModel, ColeccionDato } from './collection.interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { CacheService } from '../../../../../Gdev-Tools/cache/cache.service';
import { switchMap, startWith } from 'rxjs/operators';
import { Loading } from '../../../../../Gdev-Tools/loading/loading.service';
import { AlertService } from '../../../../../Gdev-Tools/alerts/alert.service';

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
    private _alerts: AlertService
  ) {
    this.getCollections()
  }
  
  async getCollections() {
    this.coleccionesList = []
    var user = await this._cache.getDataKey( 'user' )
    var agenteId = await this._cache.getDataKey( 'agenteId' )
    this.coleccionesPath = `usuarios/${ user.uid }/agentes/${ agenteId }/colecciones`
    var colsDoc = await this.fs.collection(this.coleccionesPath).ref.get()
    if ( colsDoc.size > 0 ) {
      await this._loading.asyncForEach( colsDoc.docs,
        col => { this.coleccionesList.push(col.data()) })
    }
    console.log(this.coleccionesList);
    return this.coleccionesList
    
  }


  async addColeccion( coleccion ) {
    var newCol = this.coleccionesList.find(col => col.name == coleccion.name)
    console.log(newCol);
    if ( newCol ) {
      this._alerts.sendMessageAlert('elige otro nombre por que ese ya existe en tus colecciones')
    } else {
      newCol = {name: coleccion.name, tipo: coleccion.tipo}
      console.log(newCol);
      this.fs.collection( this.coleccionesPath ).ref.doc( newCol.name ).set( newCol )
      .then(() => this.getCollections())
    }
    return 
  }


  async updateDataColeccion( coleccion: ColeccionModel) {
    await this.fs.collection( this.coleccionesPath ).ref.doc( coleccion.name )
      .update( { queryData: coleccion.queryData } )
    return 
  }

  async delete(colName) {
    await this.fs.collection( this.coleccionesPath ).ref.doc( colName )
    .delete().then(()=> this.getCollections())
  }
  

}
