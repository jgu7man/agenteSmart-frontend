import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase/app'
import { Router } from '@angular/router';
import { of, Observable, Subject } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
// import * as google from 'googleapis'
import { GdevLoading } from '../../gdev-tools/src/lib/loading/loading.service';
import {GdevCache} from '../../gdev-tools/src/lib/cache/gdev-cache.service';
// import * as firebase from 'firebase/app';
// import 'firebase/auth';




@Injectable( {
  providedIn: 'root'
} )
export class AuthService {
  
  user$: Observable<any>
  
  authenticated$: Subject<any> = new Subject()
  
  
  constructor (
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private _http: HttpClient,
    private _loading: GdevLoading,
    private _cache: GdevCache,
    ) {
      console.time('user')
      
    //? Método para cargar el usuario autenticado de manera asíncrona
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => { return user ? 
         this.afs.doc<UserInterface>(`usuarios/${user.uid}`).valueChanges() :
         of(null);
      })
    )
    
    
   }

  async getAuthUser() {
    return await new Promise<UserInterface>( resolve => {
      this.user$.pipe( debounceTime( 100 ) )
        .subscribe( res => resolve( res ) )
    })
  }
  
  async getCurrentUser(): Promise<UserInterface> {
    let user = await this._cache.getAsyncKey('user') as UserInterface
    return user
  }
  
  

  
  
  
   // ? Iniciar sesión con una cuenta google
  async googleSingIn() {
   

    // Abre el popup de autenticación
    const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({'prompt': 'select_account'})
    var credential = await this.afAuth.signInWithPopup(provider)
      
    
      
    // Guardar los datos de cliente nuevo en firebase
    return this.updateUserData(credential.user)

  }

  private async updateUserData({ uid, email, displayName, photoURL }: UserInterface) {
    // Buscar el usuario en la base de datos de firebase
    const userRef: AngularFirestoreDocument<UserInterface> = this.afs.doc(`usuarios/${uid}`);
    const userDoc = await this.afs.collection('usuarios').ref.doc(uid).get()
    const dateRegist = new Date()
    
    // Si no existe, se agrega fecha de registro
    if (userDoc.exists) {
      var data = { uid, email, displayName, photoURL }
      userRef.set( data, { merge: true } )
      this._cache.updateData( 'user', userDoc.data() )
      this.router.navigate(['/dashboard'])
      // localStorage.setItem('mii', JSON.stringify(userDoc.data()))
    } else {
      var newData = { uid, email, displayName, photoURL, dateRegist }
      userRef.set( newData, { merge: true } )
      this._cache.updateData( 'user', newData )
      // localStorage.setItem('mii', JSON.stringify(newData))
    }

    
    this.router.navigate(['']);
  }


  // ? Obtiene token
  async getToken() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    var credential = await (await this.afAuth.signInWithPopup(provider))
    console.log( credential )
    
    var json = await credential.credential.toJSON()
    console.log(json)
    var accessToken = json[ 'oauthAccessToken' ]
    localStorage.setItem('access_token', accessToken)

    console.log({accessToken})
    return 
    
  }



  //? Cerrar sesión

  async singOut() {
    await this.afAuth.signOut();
    localStorage.removeItem( 'mii' )
    sessionStorage.removeItem('as-data')
    return this.router.navigateByUrl('/', {skipLocationChange: true})
      .then(() => this.router.navigate(['/']));
  }


  



  // openPopup (): Observable<any> {
  //   const name = 'Authorization'
  //   const options = `width=${ 500 },height=${ 600 },left=${ 0 },top=${ 0 }`;
  //   const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=683912406589-acc9kkbnqu7qgao221kuk6aqanqli01b.apps.googleusercontent.com&response_type=code&include_granted_scopes=true&scope=https%3A//www.googleapis.com/auth/cloud-platform&redirect_uri=http://localhost:4200/appadmin/code&access_type=offline`;

  //   window.open( url, name );
  //   return this.authenticated$
  // }


  // authApi (code): Observable<any> {

  //   let headers = new HttpHeaders( {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   } )

  //   console.log(code)

  //   let body = `code=${code}&client_id=683912406589-acc9kkbnqu7qgao221kuk6aqanqli01b.apps.googleusercontent.com&client_secret=FsTiRJz155vCC0CE3HRu-v0u&grant_type=authorization_code&redirect_uri=http://localhost:4200/appadmin/code`


  //   return this._http.post( `https://www.googleapis.com/oauth2/v4/token`,
  //     body, { headers: headers } )
  // }

  

}


export interface UserInterface {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    
    }