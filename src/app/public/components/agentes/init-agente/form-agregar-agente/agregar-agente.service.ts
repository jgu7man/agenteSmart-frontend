import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService, UserInterface } from 'src/app/admin/auth/auth.service';
import { AgenteModel } from '../agente.model';

@Injectable({
  providedIn: 'root'
})
export class AgregarAgenteService {

  user: UserInterface
  constructor (
    private afs: AngularFirestore,
    private auth: AuthService
  ) { 
    this.auth.user$.pipe().subscribe( user => {
      if ( user ) { this.user = user }
    })
  }
  

  async agregarAgente(agente: AgenteModel) {
    var userRef = this.afs.collection( 'usuarios' ).ref.doc( this.user.uid )
    var agentesCol = userRef.collection( 'agentes' )
    var agenteAgregado = await agentesCol.add( {
      clientToken: agente.clientToken,
      developerToken: agente.developerToken
    })
  }

}
