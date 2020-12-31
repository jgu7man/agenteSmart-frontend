import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TextService } from './../../../../../gdev-tools/text/gdev-text.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { AgenteModel } from '../agente.model';
import { AuthService } from 'src/app/admin/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInterface } from 'src/app/admin/auth/auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CreatingComponent } from '../creating/creating.component';
import { AlertService } from '../../../../../gdev-tools/alerts/alert.service';
import { AgentConfigService } from '../../agente/agent-config/agent-config.service';
import { ContextoModel } from '../../agente/contextos/contexto.model';

interface doc {
    user: string,
    agente: string
}

@Injectable( {
    providedIn: 'root'
} )
export class CrearAgenteService {

    creatingDialog: MatDialogRef<CreatingComponent>

    constructor (
        private _http: HttpClient,
        private _auth: AuthService,
        private afs: AngularFirestore,
        private router: Router,
        private _text: TextService,
        private _dialog: MatDialog,
        private _alerts: AlertService,
        private _config: AgentConfigService,
    ) { }

    waitFor = ( ms ) => new Promise( r => setTimeout( r, ms ) )
    Doc: doc = { user: '', agente: '' }

    // ? Guardar datos en base de datos
    async saveAgent( agente: AgenteModel ) {

        this.creatingDialog = this._dialog.open( CreatingComponent, {
            minWidth: 300
        } )

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

                agente.avatarUri = agente.avatarUri ? agente.avatarUri : {url:'favicon.ico', alt:''}
                agente.description = agente.description ? agente.description : `Agente de ${ user.email }`
                // Transformar id para generar un string único
                var sufixId = agente.displayName.split( ' ' ).join( '-' ).toLowerCase()
                agente.projectId = `${ sufixId }-${ this._text.generateRandomText( 6 ) }`
                console.log( { projectId: agente.projectId } )

                // Guardado a Firestore
                const userRef = this.afs.collection( 'usuarios' ).ref.doc( user.uid )
                const agentesColl = userRef.collection( 'agentes' )
                const agenteNuevo = await agentesColl.doc( agente.projectId )
                    .set( {
                        displayName: agente.displayName,
                        avatarUri: agente.avatarUri,
                        description: agente.description,
                        created: new Date(),
                        projectId: agente.projectId,
                    } )


                this.Doc = {
                    user: user.uid,
                    agente: agente.projectId
                }
                console.log( user.uid );

                // * Crear el agente
                this.createNewAgent( agente ).subscribe( () => {
                    this._config.restoreDefaultIntent( 'Default Context Intent' )

                    this.afs.collection(
                        `usuarios/${ user.uid }/agentes/${ agente.projectId }/contextos/`
                    ).add( {
                        contextName: 'Contextos',
                    }).then(cont => cont.update({ id: cont.id}))
                    this.router.navigate(['/dashboard/agentes'])
                    this.creatingDialog.close()
                } )

            } )
        } catch ( error ) {
            console.error( error );
            this.creatingDialog.close()
            this._alerts.sendError('No se pudo crear tu agente', error)
        }



    }






    // ? Crear proyecto
    createNewAgent( agente: AgenteModel ): Observable<{}> {
        const _Url = "https://us-central1-main-agentesmart.cloudfunctions.net/dialogflow/agentes/create"

        console.log( agente );


        let params = { ...agente }
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
            this._alerts.sendError( 'No se pudo crear tu agente', error.message )
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${ error.status }, ` +
                `body was: ${ error.error }` );
            this._alerts.sendError( `Backend returned code ${ error.status } `, error.error)
            
        }
        // delete the recent docuement
        console.log( this.Doc );
        this.afs.collection( 'usuarios' ).ref.doc( this.Doc.user )
            .collection( 'agentes' ).doc( this.Doc.agente ).delete()
        // return an observable with a user-facing error message

        this.creatingDialog.close()
        return throwError(
            'Something bad happened; please try again later.' );
    }





}


