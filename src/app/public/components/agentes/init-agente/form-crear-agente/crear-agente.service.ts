import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AgenteModel } from '../agente.model';
import { AuthService } from 'src/app/admin/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInterface } from 'src/app/admin/auth/auth.service';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AgenteService {
  
  constructor(
    private _http: HttpClient,
    private _auth: AuthService,
    private afs: AngularFirestore
  ) { }

  waitFor = (ms) => new Promise(r => setTimeout(r, ms))
  
  
  // ? Guardar datos en base de datos
  async saveAgent(agente: AgenteModel) {


      try {
        this._auth.user$.pipe().subscribe( async ( user ) => {
          // var user: UserInterface = authUser.user

          console.log( user )
          // Eliminar campos vacios
          Object.keys( agente ).forEach( key => {
            if ( agente[ key ] == '' || agente[ key ] == undefined ) delete agente[ key ]
          } )

          agente = { ...agente }
          console.log( { agente } )


          // Guardado a Firestore
          const userRef = this.afs.collection( 'usuarios' ).ref.doc( user.uid )
          const agentesColl = userRef.collection( 'agentes' )
          const agenteNuevo = await agentesColl.add( agente )


          // Transformar id para generar un string único
          // Juntar el nombre del agente sin espacios más 6 dígitos del ID generado
          // por el Firebase
          var sufixId = agente.displayName.split( ' ' ).join( '-' )
          var codeId = agenteNuevo.id.slice( 0, 6 ).toLowerCase()


          agente[ 'agenteId' ] = `${ sufixId }-${ codeId }`
          console.log( { agenteId: agente.agenteId } )


          this.waitFor( 5000 )


          // * Espera la creación del proyecto
          // await this.createProject(agente).toPromise()

          // * Crear el agente
          await this.createNewAgent( agente ).subscribe( () => {
            console.log( 'creado' )
          } )

        } )
      } catch (error) {
        console.error(error);
      }
      

  }

  
  
  
  
  
  // ? Crear proyecto
  createNewAgent( agente: AgenteModel ): Observable<{}> {
    // const _Url = "https://us-central1-main-agentesmart.cloudfunctions.net/createProject"

    console.log(agente);

    const _Url = "http://localhost:5000/main-agentesmart/us-central1/dialogflow/agentes/create"

    let params = {...agente}
    return this._http.post<{}>( _Url, params, {
      responseType: 'json',
      observe: 'body'
    } ).pipe(
      catchError( this.handleError )
    )
  }

  private handleError( error: HttpErrorResponse ) {
    if ( error.error instanceof ErrorEvent ) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error( 'An error occurred:', error.message );
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${ error.status }, ` +
        `body was: ${ error.error }` );
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.' );
  }


  
  

}


