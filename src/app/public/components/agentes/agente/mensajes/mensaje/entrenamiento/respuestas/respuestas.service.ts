import { AlertService } from './../../../../../../../../Gdev-Tools/alerts/alert.service';
import { Injectable } from '@angular/core';
import { IntentModel, ParametroMensaje } from '../../../mensaje.model';
import { Contexto } from '../../../../contextos/contexto.model';
import { AccionModel } from '../../../../acciones/accion.model';
import { MensajesService } from '../../../mensajes.service';
import { ContextosService } from '../../../../contextos/contextos.service';
import { CurrentMensajeService } from '../../current-mensaje.service';
import { CacheService } from '../../../../../../../../Gdev-Tools/cache/cache.service';
import { Loading } from '../../../../../../../../Gdev-Tools/loading/loading.service';
import { CurrentAgenteService } from '../../../../current-agente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { RespuestaModel } from './respuesta.model';
import { Subject, Observable, Observer, forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { ParametrosService } from '../parametros/parametros.service';
import { TiposService } from '../../../../tipos/tipos.service';
import { TipoEntidadModel } from '../../../../tipos/tipo.model';



@Injectable( {
   providedIn: 'root'
} )
export class RespuestasService {

   mensajesList: IntentModel[]
   currentMensaje: IntentModel
   currentMensajeName: string
   nextMensaje: string
   contextList: Contexto[]
   currentContext: string
   paramList: ParametroMensaje[]
   mensajesPath: string
   respuestasList: Subject<RespuestaModel[]> = new Subject()
   respuestaAdded: Subject<any> = new Subject()
   tiposList: TipoEntidadModel[]

   acciones: AccionModel[] = [
      { accion: 'guardar', ruta: '' },
      { accion: 'editar', ruta: '' },
      { accion: 'buscar', ruta: '' },
      { accion: 'borrar', ruta: '' },
   ]

   estiloResps: EstiloResp[] = [
      { name: 'texto', display: 'Texto' },
      { name: 'sugerencias', display: 'Sugerencias' },
      { name: 'card', display: 'Tarjeta' },
   ]

   constructor (
      private _agente: CurrentAgenteService,
      private fs: AngularFirestore,
      private _mensaje: CurrentMensajeService,
      private _cache: CacheService,
      private loading: Loading,
      private _alerts: AlertService,
      private _tipos: TiposService,
   ) {
      this.initRespData()
   }

  


   /** Obtiene constante actualizado la ruta del mensaje en curso para los métodos del CRUD */
   async responsesPath() {
      
      this.loading.waitFor( 100 )
      if ( !this.currentMensajeName ) {
         this.currentMensajeName = await this._cache.getDataKey('currentMensajeName')
      }

      this.mensajesPath = await this._agente.getPath( `mensajes` )
      const mensajesRef = this.fs.collection( `${ this.mensajesPath }/${ this.currentMensajeName }/respuestas` ).ref
      return mensajesRef
   }




   /** Obtiene la data del mensaje en curso */
   async initRespData() {
      var allData = await this._cache.getFullData()
      this.contextList = allData[ 'allContexts' ]
      this.mensajesList = allData[ 'allMensajesList' ]
      this.currentContext = allData[ 'currentContexto' ]
      
      this._mensaje.current$.subscribe( mensaje => {
         if ( mensaje ) {
            this.currentMensaje = mensaje
            this.paramList = this.currentMensaje.parameters
            this.getNextMensaje()
            this.getTipos(mensaje.parameters)
         }
      } )

      return
   }

   async getTipos( paramList: ParametroMensaje[]  ) {
      this.tiposList = []
      await this.loading.asyncForEach( paramList, async( param:ParametroMensaje) => {
         let tipo = this.tiposList.find( t => t.name == param.displayName )
         console.log(tipo);
         if ( !tipo ) {
            tipo = await this._tipos.getByName( param.displayName )
            await this.loading.waitFor(100)
            return this.tiposList.push(tipo)
         }
      } )
      console.log(this.tiposList);
   }


   async getNextMensaje() {
      const contextosList = await this._cache.getDataKey( 'contextosLists' )
      var mensajes: IntentModel[] = contextosList ?
         contextosList[ this.currentContext ] : []
      if ( mensajes.length > 0 )
         var currentIntenIndex = mensajes.findIndex
            ( intent => intent.name == this.currentMensaje.name );

      this.nextMensaje = currentIntenIndex == mensajes.length - 1 ? '' : mensajes[ currentIntenIndex + 1 ].displayName
   }

   async getMensajeResponses() {
      var mensajeResponses: RespuestaModel[] = []
      let currentContexto = await this._cache.getDataKey( 'currentContexto' )
      if ( currentContexto ) {
         let responses = await ( await this.responsesPath() ).where( 'inputContext', '==', currentContexto ).get();
         responses.forEach( resp => mensajeResponses.push( resp.data() as RespuestaModel ) )
      }
      return mensajeResponses
   }

   



   async addRespuesta( respuesta: RespuestaModel ) {
      const mensajesList: RespuestaModel[] = await this.getMensajeResponses()
      var predef: boolean[] = []
      // Revisa que no exista una predefinida
      await this.loading.asyncForEach( mensajesList,
         msj => { if ( msj.tipo == 'predefinida' ) predef.push(true) } );

      console.log( respuesta );
      console.log(predef);

      if ( respuesta.id ) {
         console.log( 'update' );
         ( await this.responsesPath() ).doc( respuesta.id )
            .set( respuesta, { merge: true } );
         this._alerts.sendFloatNotification('Respuesta actualizada')

      } else {
         console.log( 'create' );
         if ( predef.length >= 1 && respuesta.tipo == 'predefinida') {
            this._alerts.sendMessageAlert( 'No puedes agregar más de una respuesta predefinida' );
         } else {
            let res = await ( await this.responsesPath() ).add( respuesta )
            await ( await this.responsesPath() ).doc( res.id ).update( { id: res.id } )
         }
      }

      return this.respuestaAdded.next( true )

   }


   delRespuesta( respuestaId: string ) {

   }
}



export interface EstiloResp {
   name: string,
   display: string
}




