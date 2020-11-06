import { Injectable } from '@angular/core';
import { ColeccionModel } from './collection.interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { CacheService } from '../../../Gdev-Tools/cache/cache.service';
import { Loading } from '../../../Gdev-Tools/loading/loading.service';
import { AlertService } from '../../../Gdev-Tools/alerts/alert.service';
import { CurrentAgenteService } from '../agentes/agente/current-agente.service';
import { AuthService, UserInterface } from '../../../admin/auth/auth.service';
import { Observable } from 'rxjs';
import {flatMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColeccionesService {

  list: ColeccionModel[]
  coleccionesPath: string
  usuario: UserInterface

  constructor (
    private fs: AngularFirestore,
    private _cache: CacheService,
    private _loading: Loading,
    private _alerts: AlertService,
    private _currentAgent: CurrentAgenteService,
    private _auth: AuthService
  ) {
    this.getColecciones()
  }

  async coleccionesRef() {
    return this.fs.collection(this.coleccionesPath).ref
  }
  
  async getColecciones() {
    this.usuario = await this._cache.getAsyncKey<UserInterface>('user')
    this.coleccionesPath = `usuarios/${this.usuario.uid}/colecciones`
    
    this.fs.collection<ColeccionModel>(this.coleccionesPath)
      .valueChanges()
      .pipe(flatMap(
        list => this._cache.updateData<ColeccionModel[]>('colecciones', list)))
      .subscribe()
    
    this.list = await this._cache.getAsyncKey<ColeccionModel[]>('colecciones')
  }

  
  async addColeccion( coleccion ) {
    var newCol = this.list
    .find( col => col.name == coleccion.name );
    
    if ( newCol ) {
      this._alerts.sendMessageAlert('elige otro nombre por que ese ya existe en tus colecciones')
    } else {
      newCol = { name: coleccion.name }
      console.log(newCol);
      (await this.coleccionesRef()).doc( newCol.name ).set( newCol )
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
