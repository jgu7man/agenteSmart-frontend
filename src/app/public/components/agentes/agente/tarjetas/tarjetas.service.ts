import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TarjetaModel } from './tarjeta.model';
import { CurrentAgenteService } from '../current-agente.service';

@Injectable({
  providedIn: 'root'
})
export class TarjetasService {

  constructor (
    private fs: AngularFirestore,
    private _agente: CurrentAgenteService
  ) { }



  saveTarjeta(tarjeta: TarjetaModel) {
    
  }

}
