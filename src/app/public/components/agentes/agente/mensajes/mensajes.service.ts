import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TextService } from '../../../../../services/text.service';
import { CacheService } from '../../../../../Gdev-Tools/cache/cache.service';
import { CurrentAgenteService } from '../current-agente.service';
import { Loading } from '../../../../../Gdev-Tools/loading/loading.service';
import { Contexto } from '../contextos/contexto.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GdevAlertServiceModule } from '../../../../../Gdev-Tools/alerts/gdev-alert-service.module';
import { AlertService } from '../../../../../Gdev-Tools/alerts/alert.service';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  mensajesPath: string
  
  
  constructor (
    private fs: AngularFirestore,
    private _alerta: AlertService,
    private _text: TextService,
    private _cache: CacheService,
    private _agente: CurrentAgenteService,
    private _loading: Loading,
    private _route: ActivatedRoute,
    private router: Router
  ) {
    
    }
    
  
  async mensajesCollection() {
    this.mensajesPath = await this._agente.getPath( 'mensajes' )
    const mensajesRef = this.fs.collection( this.mensajesPath ).ref
    return mensajesRef
  }
  
    

  // SECTION CRUD de mensajes
  
  
  // CREATE Mensajes


  async setMensaje( mensajeName: string, contexto: string, index?:number ) {
    

    const name = this._text.normalize( mensajeName.toLowerCase() )
    
    // READ Busca en las mensajes que no esté duplicada
    const mensajeList = await this.getAllMensajesList()
    if ( mensajeList.includes( name ) ) {
      console.log(name, ' duplicada');
      this._alerta.sendMessageAlert( 'Mensaje Duplicada' )
    } else {
    


      
      await (await this.mensajesCollection()).doc( name )
        .set( {
          index: index,
          name: name,
          displayName: mensajeName,
          contextos: [ contexto ]
        } )
      return true
    }


  }


  

  // READ ENTRADAS

  async getAllMensajesList() {
    var mensajesList = []
      const mensajeCol = await ( await this.mensajesCollection() ).get()
      await this._loading.asyncForEach( mensajeCol.docs, mensaje => { mensajesList.push( mensaje.data() ) } )
      await this._cache.updateData( 'todosMensajesList', mensajesList )
    return mensajesList
  }


  async getMensajesListByContexto( contexto: Contexto ) {
    var mensajesList = []
    const mensajeCol = await ( await this.mensajesCollection() ).where( 'contextos', 'array-contains', contexto.id ).get()
    
    await this._loading.asyncForEach( mensajeCol.docs, mensaje => { mensajesList.push( mensaje.data() ) } )
    await this._cache.updateData( 'mensajesList:'+contexto.contextName, mensajesList )
    return mensajesList
  }

  async getMensajesListByContextoName( contextoName: string ) {
    var mensajesList = []
    const mensajeCol = await ( await this.mensajesCollection() ).where( 'inputContextNames', 'array-contains', contextoName ).get()
    
    await this._loading.asyncForEach( mensajeCol.docs, mensaje => { mensajesList.push( mensaje.data() ) } )
    await this._cache.updateData( 'mensajesList:'+contextoName, mensajesList )
    return mensajesList
  }

  



  

}
