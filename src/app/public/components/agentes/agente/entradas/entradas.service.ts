import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { AuthService, UserInterface } from '../../../../../admin/auth/auth.service';
import { AlertService } from '../../../../../global/alert/alert.service';
import { TextService } from '../../../../../services/text.service';
import { CacheService } from '../../../../../global/cache/cache.service';
import { AgentesService } from '../../agentes.service';
import { CurrentAgenteService } from '../agente.service';
import { EntradaModel } from './entrada.model';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntradasService {

  entradasPath: string
  entradasOfContext$:Subject<EntradaModel> = new Subject() 
  
  constructor (
    private fs: AngularFirestore,
    private _auth: AuthService,
    private _alerta: AlertService,
    private _text: TextService,
    private _cache: CacheService,
    private _agente: CurrentAgenteService
    ) {
    }
    
    
  async entradasCollection() {
    this.entradasPath = await this._agente.getAgentePath( 'entradas' )
    const entradasRef = this.fs.collection( this.entradasPath ).ref
    return entradasRef
  }
    
  
  


  async setEntrada( entradaName: string, contexto: string ) {
    

    const name = this._text.normalize( entradaName.toLowerCase() )
    
    const entradaList = await this.getAllEntradasList()
    if ( entradaList.length > 0 ) {
      if ( !entradaList.includes( name ) ) {

        console.log(name);

        await (await this.entradasCollection()).doc(name)
          .set( {
            name: name,
            displayName: entradaName,
            contextos: [contexto]
          }, { merge: true } )
        
        return true
      } else {
        this._alerta.sendAlertMessage( 'Entrada Duplicada' )
      }
    } else {
      console.log(name);

      await (await this.entradasCollection()).doc( name )
        .set( {
          name: name,
          displayName: entradaName,
          contextos: [ contexto ]
        } )
      return true
    }


  }

  async getAllEntradasList() {
    const entradaCol = await (await this.entradasCollection()).get()
    const entradaList = []
    entradaCol.forEach( entrada => { entradaList.push( entrada.id ) } )
    return entradaList
  }


  async getEntradasListByContextoId( contextoId: string ) {
    const entradaCol = await (await this.entradasCollection()).where('contextos', 'array-contains', contextoId).get()
    const entradaList = []
    entradaCol.forEach( entrada => { entradaList.push( entrada.data()) } )
    return entradaList
  }

  async getEntradasListByContextoName( contextoName: string ) {
    const entradaCol = await (await this.entradasCollection()).where( 'inputContextNames', 'array-contains', contextoName ).get()
    const entradaList = []
    entradaCol.forEach( entrada => { entradaList.push( entrada.id ) } )
    return entradaList
  }


  async updateEntradaName( entrada: EntradaModel ) {
    

    
  }

}
