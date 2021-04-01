import { Injectable } from '@angular/core';
import { AuthService, UserInterface } from '../../../admin/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  currentUser: UserInterface
  constructor (
    private _auth: AuthService,
    private fs: AngularFirestore
  ) {
    this.getCurrentUser()
   }
  
  async getCurrentUser() {
    this.currentUser = await this._auth.getCurrentUser()
  }

  get currentUserPath() {
    return this.fs.doc(`usuarios/${this.currentUser.uid}`).ref
  }
}
