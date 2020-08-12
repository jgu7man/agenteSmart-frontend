import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { AuthService, UserInterface } from '../../../../../admin/auth/auth.service';
import { AlertService } from '../../../../../global/alert/alert.service';
import { TextService } from '../../../../../services/text.service';
import { CacheService } from '../../../../../global/cache/cache.service';
import { AgentesService } from '../../agentes.service';
import { CurrentAgenteService } from '../current-agente.service';
import { EntradaModel } from './entrada.model';
import { Subject, Observable } from 'rxjs';
import { Loading } from '../../../../../global/loading/loading.service';
import { Contexto } from '../contextos/contexto.model';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EntradasService {

  entradasPath: string
  
  
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
    
  
  async entradasCollection() {
    this.entradasPath = await this._agente.getPath( 'entradas' )
    const entradasRef = this.fs.collection( this.entradasPath ).ref
    return entradasRef
  }
  
    

  // SECTION CRUD de entradas
  
  
  // CREATE Entradas


  async setEntrada( entradaName: string, contexto: string, index?:number ) {
    

    const name = this._text.normalize( entradaName.toLowerCase() )
    
    // READ Busca en las entradas que no esté duplicada
    const entradaList = await this.getAllEntradasList()
    if ( entradaList.includes( name ) ) {
      console.log(name, ' duplicada');
      this._alerta.sendAlertMessage( 'Entrada Duplicada' )
    } else {
    


      
      await (await this.entradasCollection()).doc( name )
        .set( {
          index: index,
          name: name,
          displayName: entradaName,
          contextos: [ contexto ]
        } )
      return true
    }


  }


  

  // READ ENTRADAS

  async getAllEntradasList() {
    var entradasList = []
      const entradaCol = await ( await this.entradasCollection() ).get()
      await this._loading.asyncForEach( entradaCol.docs, entrada => { entradasList.push( entrada.data() ) } )
      await this._cache.updateData( 'todasEntradasList', entradasList )
    return entradasList
  }


  async getEntradasListByContexto( contexto: Contexto ) {
    var entradasList = []
    const entradaCol = await ( await this.entradasCollection() ).where( 'contextos', 'array-contains', contexto.id ).get()
    
    await this._loading.asyncForEach( entradaCol.docs, entrada => { entradasList.push( entrada.data() ) } )
    await this._cache.updateData( 'entradasList:'+contexto.contextName, entradasList )
    return entradasList
  }

  async getEntradasListByContextoName( contextoName: string ) {
    var entradasList = []
    const entradaCol = await ( await this.entradasCollection() ).where( 'inputContextNames', 'array-contains', contextoName ).get()
    
    await this._loading.asyncForEach( entradaCol.docs, entrada => { entradasList.push( entrada.data() ) } )
    await this._cache.updateData( 'entradasList:'+contextoName, entradasList )
    return entradasList
  }

  



  

}
