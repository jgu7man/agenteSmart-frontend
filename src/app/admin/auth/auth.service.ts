import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { auth } from 'firebase/app'
import { Router } from '@angular/router';
import { of, Observable, Subject, throwError } from 'rxjs';
import { switchMap, first, catchError, take } from 'rxjs/operators';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
// import * as google from 'googleapis'
import { Loading } from '../../global/loading/loading.service';

// const oauth2Client = new google.auth.OAuth2(
//   '683912406589-acc9kkbnqu7qgao221kuk6aqanqli01b.apps.googleusercontent.com',
//   'FsTiRJz155vCC0CE3HRu-v0u',
//   'http://localhost'
// );

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
    private loading: Loading
    ) {
      

    //? Método para cargar el usuario autenticado de manera asíncrona
    this.user$ = this.afAuth.authState.pipe(
      switchMap( user => { return user ? 
          this.afs.doc<UserInterface>(`usuarios/${user.uid}`).valueChanges() :
          of(null);
      })
    )
   }

  
  
  async getCurrentUser() {
    var user = JSON.parse( sessionStorage.getItem( 'aSmart-user' ) )
    
    if ( !user ) {
      
      var user2 = await this.user$.pipe( take( 1 ) ).toPromise()
      console.log( user2 );
      sessionStorage.setItem('aSmart-user', JSON.stringify(user2))
      return user2
      
    } else {
      
      return user
    }
  }
  
  

  
  
  
   // ? Iniciar sesión con una cuenta google
  async googleSingIn() {
   

    // Abre el popup de autenticación
    const provider = new auth.GoogleAuthProvider();
    var credential = await this.afAuth.auth.signInWithPopup(provider)
      
    
      
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
      userRef.set(data, { merge: true })
      localStorage.setItem('mii', JSON.stringify(userDoc.data()))
    } else {
      var newData = { uid, email, displayName, photoURL, dateRegist }
      userRef.set(newData, { merge: true })
      localStorage.setItem('mii', JSON.stringify(newData))
    }

    
    this.router.navigate(['']);
  }


  // ? Obtiene token
  async getToken() {
    const provider = new auth.GoogleAuthProvider();

    // var authed = await this.afAuth.authState.pipe(first()).toPromise() ? true : false;

    // console.log({authed})

    // if (!authed) {

    var credential = await (await this.afAuth.auth.signInWithPopup(provider))
    
    console.log( credential )
    
    var json = await credential.credential.toJSON()
    console.log(json)
    var accessToken = json[ 'oauthAccessToken' ]
    localStorage.setItem('access_token', accessToken)

      // localStorage.setItem('accessToken', accessToken )
    // } else {
      
      // var accessToken = localStorage.getItem('accessToken')
      // if(!accessToken){
      //   var credential = await (await this.afAuth.auth.signInWithPopup(provider))
      //   var json = await credential.credential.toJSON()
      //   var accessToken = json['oauthAccessToken']
      //   localStorage.setItem('accessToken', accessToken)
      // }

    // }
    // Obtener el token
    // var token = await this.afAuth.auth.currentUser.getIdTokenResult(false)
    // console.log(token)


    console.log({accessToken})
    return 
    
  }



  //? Cerrar sesión

  async singOut() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('mii')
     return this.router.navigate(['/']);
  }


  async googleApis() {
    // const url = await oauth2Client.generateAuthUrl( {
    //   access_type: 'offline',
    //   scope: [
    //     'https://www.googleapis.com/auth/cloud-platform',
    //     'https://www.googleapis.com/auth/cloudplatformprojects'
    //   ]
    // } );

    // const { tokens } = await oauth2Client.getToken( code )
    // oauth2Client.setCredentials( tokens );
    return
  }



  openPopup (): Observable<any> {
    const name = 'Authorization'
    const options = `width=${ 500 },height=${ 600 },left=${ 0 },top=${ 0 }`;
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=683912406589-acc9kkbnqu7qgao221kuk6aqanqli01b.apps.googleusercontent.com&response_type=code&include_granted_scopes=true&scope=https%3A//www.googleapis.com/auth/cloud-platform&redirect_uri=http://localhost:4200/appadmin/code&access_type=offline`;

    window.open( url, name );
    return this.authenticated$
  }


  authApi (code): Observable<any> {

    let headers = new HttpHeaders( {
      'Content-Type': 'application/x-www-form-urlencoded'
    } )

    console.log(code)

    let body = `code=${code}&client_id=683912406589-acc9kkbnqu7qgao221kuk6aqanqli01b.apps.googleusercontent.com&client_secret=FsTiRJz155vCC0CE3HRu-v0u&grant_type=authorization_code&redirect_uri=http://localhost:4200/appadmin/code`


    return this._http.post( `https://www.googleapis.com/oauth2/v4/token`,
      body, { headers: headers } )
  }

  

}


export interface UserInterface {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    
    }