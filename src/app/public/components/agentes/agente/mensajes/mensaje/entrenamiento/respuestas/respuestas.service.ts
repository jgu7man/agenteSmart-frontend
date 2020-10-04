import { AlertService } from 'src/app/Gdev-Tools/alerts/alert.service';
import { Injectable } from '@angular/core';
import { IntentModel, ParametroMensaje } from '../../../mensaje.model';
import { ContextoModel } from '../../../../contextos/contexto.model';
import { AccionModel } from '../../../../acciones/accion.model';
import { CurrentMensajeService } from '../../current-mensaje.service';
import { CacheService } from 'src/app/Gdev-Tools/cache/cache.service';
import { Loading } from 'src/app/Gdev-Tools/loading/loading.service';
import { CurrentAgenteService } from '../../../../current-agente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { RespuestaModel } from './respuesta.model';
import { Subject } from 'rxjs';
import { TiposService } from '../../../../tipos/tipos.service';
import { TipoEntidadModel } from '../../../../tipos/tipo.model';
import { ColeccionModel } from '../../../../colecciones/collection.interface';
import { TarjetaModel } from '../../../../tarjetas/tarjeta.model';



@Injectable( {
   providedIn: 'root'
} )
export class RespuestasService {

   /** @module Respuestas */

   /** Contiene todos los mensajes siempre actualizado */
   mensajesList: IntentModel[]
   /** Contiene la lista de contextos siempre actualizada */
   contextList: ContextoModel[]
   coleccionesSaveList: ColeccionModel[]
   coleccionesQueryList: ColeccionModel[]
   tarjetasList: TarjetaModel[]
   /** El mensae en curso de edición */
   currentMensaje: IntentModel
   /** El id de mensaje en curso para consultas */
   currentMensajeName: string
   /** El siguiente mensaje en el contexto actual
   * @name nextMensaje
   */
   nextMensaje: string
   /** El contexto actual */
   currentContext: string
   /** Contiene la lista de parámetros */
   paramList: ParametroMensaje[]
   /** La ruta a la base de datos de los mensajes */
   mensajesPath: string
   /** Observable de la lista de respuestas */
   respuestasList: RespuestaModel[]
   /** Observable de las respuestas cuando se agregó, editó o eliminó alguna respuesta */
   onRespuestasChanged: Subject<any> = new Subject()
   /** Contiene la lista de tipos de datos */
   tiposList: TipoEntidadModel[]
   /** Contiene el tipo de acciones */
   acciones: AccionModel[] = [
      { accion: 'guardar', ruta: '' },
      { accion: 'editar', ruta: '' },
      { accion: 'buscar', ruta: '' },
      { accion: 'borrar', ruta: '' },
   ]
   /** Lista de tipos de respuesta
    * @variation `texto` para respuestas de sólo texto.
    * @variation `sugerencias` para crear un arreglo de sugerencias
    * @variation `card` para usar una tarjeta de imagen, texto, título y botones
    * @type {EstiloResp[]}
    * @memberof RespuestasService
    */
   estiloResps: EstiloResp[] = [
      { name: 'texto', display: 'Texto' },
      { name: 'sugerencias', display: 'Sugerencias' },
      { name: 'card', display: 'Tarjeta' },
   ]

   
   constructor (
      private fs: AngularFirestore,
      private _agente: CurrentAgenteService,
      private _mensaje: CurrentMensajeService,
      private _cache: CacheService,
      private loading: Loading,
      private _alerts: AlertService,
      private _tipos: TiposService,
   ) {
      this.initRespData()
   }




   /** Obtiene constante actualizado la ruta del mensaje en curso para los métodos del CRUD
    * @returns {string} Referencia de la colección de mensajes en firestore
    */
   async responsesPath() {
      this.loading.waitFor( 100 )
      // this._mensaje.mensajesPath

      // this.mensajesPath = await this._agente.getPath( `mensajes` )
      const respuestasRef = this.fs.collection(
         `${ this._mensaje.mensajesPath }/${ this._mensaje.mensajeName }/respuestas` )
         .ref
      return respuestasRef
   }




   /** Obtiene la data del mensaje en curso */
   async initRespData() {
      await this._agente.listenAgenteLoaded()
      this.contextList = this._agente.contextosList
      this.mensajesList = this._agente.mensajesList
      this.coleccionesSaveList = this._agente.coleccionesList
         .filter( col => col.tipo === 'guardado' );
      this.coleccionesQueryList = this._agente.coleccionesList
         .filter( col => col.tipo === 'busqueda' );
      this.tarjetasList = this._agente.tarjetasList
      this.currentContext = this._mensaje.currentContexto

      this._mensaje.current$.subscribe( mensaje => {
         if ( mensaje ) {
            this.currentMensaje = mensaje
            this.paramList = this.currentMensaje.parameters
            this.getNextMensaje()
            // this.getTipos( mensaje.parameters )
         }
      } )   

      return
   }


   /** Obtiene los tipos de datos del agente
    * @return {array} Arreglo de los tipos de datos del agente
    */
   async getTipos( paramList: ParametroMensaje[] ) {
      this.tiposList = []
      await this.loading.asyncForEach( paramList,
         async ( param: ParametroMensaje ) => {
            let tipo = this.tiposList.find( t => t.name == param.displayName )

            if ( !tipo ) {
               // tipo = await this._tipos.getByName( param.displayName )
               await this.loading.waitFor( 100 )
               return this.tiposList.push( tipo )
            }
         } )
      return this.tiposList
   }


   /** 
    * Obtiene el siguiente mensaje del contexto en curso, 
    * si es el último mensaje del contexto retorna string vacio.
    * @return vacio
    * @see {@link nextMensaje}
    */
   async getNextMensaje() {
      const contextosList = await this._cache.getDataKey( 'contextosLists' )
      var mensajes: IntentModel[] = contextosList ?
         contextosList[ this.currentContext ] : []
      
      if ( mensajes.length > 0 )
         var currentIntenIndex = mensajes.findIndex
            ( intent => intent.name == this.currentMensaje.name );

      this.nextMensaje = currentIntenIndex == mensajes.length - 1 ? '' : mensajes[ currentIntenIndex + 1 ].displayName
   }



   /**
    * Obtiene las respuestas del mensaje en curso y contexto en curso
    *
    * @return {Array} Lista de respuestas
    */
   async getMensajeResponses() {
      this.respuestasList = []
      let currentContexto = await this._cache.getDataKey( 'currentContexto' )
      if ( currentContexto ) {
         let responses = await ( await this.responsesPath() )
            .where( 'inputContext', '==', currentContexto )
            .orderBy( 'index', 'asc' )
            .get();
         responses.forEach( resp => this.respuestasList.push( resp.data() as RespuestaModel ) )
      }
      return this.respuestasList
   }





   /**
    * Agrega o actualiza respuestas al mensaje en curso
    *
    * @param {RespuestaModel} respuesta - El objeto de respuesta
    * @return {Subject} Aviso al observable de cambios en la lista de respuestas
    */
   async addRespuesta( respuesta: RespuestaModel ) {
      const mensajesList: RespuestaModel[] = await this.getMensajeResponses()
      // var predef: boolean[] = []

      // Revisa que no exista una predefinida
      // await this.loading.asyncForEach( mensajesList,
      //    msj => { if ( msj.tipo == 'predefinida' ) predef.push( true ) } );


      if ( respuesta.id ) {
         console.log( 'update' );
         ( await this.responsesPath() ).doc( respuesta.id )
            .set( respuesta, { merge: true } );
         this._alerts.sendFloatNotification( 'Respuesta actualizada' )

      } else {
         // if ( predef.length >= 1 && respuesta.tipo == 'predefinida' ) {
         //    this._alerts.sendMessageAlert( 'No puedes agregar más de una respuesta predefinida' );
         // } else {
            let res = await ( await this.responsesPath() ).add( respuesta )
            await ( await this.responsesPath() ).doc( res.id ).update( { id: res.id } )
         // }
      }

      return this.onRespuestasChanged.next( true )

   }


   



   /**
    * Elimina la respuesta seleccionada
    *
    * @param {string} respuestaId - El id de la respuesta a borrar
    * @return {Subject} Aviso al observable de cambios en la lista de respuestas
    */
   async delRespuesta( respuestaId: string ) {
      let resToDel = this.respuestasList
         .find( res => { res.id === respuestaId } )
      
      if ( resToDel ) {
         await ( await this.responsesPath() ).doc( respuestaId ).delete()
      }
      return this.onRespuestasChanged.next( true )
   }
}



/**
 * Interface para el arreglo de los estilos de respuestas
 *
 * @export
 * @interface EstiloResp
 */
export interface EstiloResp {
   name: string,
   display: string
}




