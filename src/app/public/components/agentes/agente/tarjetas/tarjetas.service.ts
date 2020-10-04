import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TarjetaModel } from './tarjeta.model';
import { CurrentAgenteService } from '../current-agente.service';
import { AlertService } from 'src/app/Gdev-Tools/alerts/alert.service';
import { GdevCommonsService } from 'src/app/Gdev-Tools/commons/gdev-commons.service';

@Injectable({
  providedIn: 'root'
})
export class TarjetasService {

  agentePath: string
  constructor (
    private fs: AngularFirestore,
    private _agente: CurrentAgenteService,
    private _alert: AlertService,
    private _commons: GdevCommonsService
  ) { }


  async tarjetaRef() {
    this.agentePath = await this._agente.getPath( 'tarjetas' )
    return this.fs.collection(this.agentePath).ref
  }


  

  // CREATE 
  async addTarjeta(tarjeta: TarjetaModel) {
    const list = this._agente.tarjetasList

    console.log(tarjeta);
    tarjeta.name = await this._commons.preventDuplicated( tarjeta, list, 'name' )
    console.log(tarjeta.name);
    
    try {
      await ( await this.tarjetaRef() ).doc( tarjeta.name )
        .set( { ...tarjeta } )
      this._alert.sendFloatNotification('Tarjeta creada', 'ok')
        return 
    } catch (error) {
      this._alert.sendError('Ups! Algo salio mal', error)
    }
  }



  // UPDATE
  async saveTarjeta(tarjeta: TarjetaModel) {
    try {
      await( await this.tarjetaRef() ).doc( tarjeta.name )
        .set( { ...tarjeta }, { merge: true } )
      this._alert.sendFloatNotification('Tarjeta guardada', 'ok')
      return
    } catch ( error ) {
      this._alert.sendError( 'Ups! Algo salio mal', error )
    }
  }


  // DELETE 
  async deleteTarjeta( tarjetaName: string ) {
    try {
      await ( await this.tarjetaRef() ).doc( tarjetaName )
      .delete()
    } catch (error) {
      this._alert.sendError( 'Ups! Algo salio mal', error )
    }
  }

  

}
