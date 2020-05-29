import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgenteModel } from '../agente.model';
import { AuthService } from 'src/app/admin/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInterface } from 'src/app/admin/auth/auth.service';


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

    // Obtener datos del usuario
    var accessToken;
    
    this.createProject().subscribe( res => {
      console.log(res)
    })


    var json = {
      access_token: "ya29.a0Ae4lvC0t_7pftEmBPxLxJ613siFpWWOswXMH8f_dcwMHvYEMcKLz9V5jstINNEuEljdbhrttSCbCeZ25b4PV-EJ_eetnbdLEAtXKyRJRFgLG61_zoE5T1CuHDYClve_sLcBeUNp-8kwHashiTSmgeYvUGEvx32IEjlQ",
      expires_in: 3599,
      refresh_token: "1//0fXFtWUnuktITCgYIARAAGA8SNwF-L9Ir6s--gv2c8TPo5PfqtFRtQyXXSOsfhtOal0ETEby1SGgwSROQooox64wJbrNT_3m4LPA",
      scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/cloud-platform",
      token_type: "Bearer",
      id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZmY2Y0MTMyMjQ3NjUxNTZiNDg3NjhhNDJmYWMwNjQ5NmEzMGZmNWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2ODM5MTI0MDY1ODktYWNjOWtrYm5xdTdxZ2FvMjIxa3VrNmFxYW5xbGkwMWIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2ODM5MTI0MDY1ODktYWNjOWtrYm5xdTdxZ2FvMjIxa3VrNmFxYW5xbGkwMWIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTU4MDgwNzkwNDE3NTgwNjczMDYiLCJlbWFpbCI6Imxhc21vdG9zYXV0ZWNvQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiaFN1Ylc1OVRIbmxaNWt6QWZwMF9GdyIsIm5hbWUiOiJMYXNtb3RvcyBBdXRlY28iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2lHOFl6ZjR6TXZFcGdsSF9IUGRKOGx0UGFSSUpZdjJaZ0p2M3FrPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ikxhc21vdG9zIiwiZmFtaWx5X25hbWUiOiJBdXRlY28iLCJsb2NhbGUiOiJlcyIsImlhdCI6MTU4NzE0MDg5MywiZXhwIjoxNTg3MTQ0NDkzfQ.i1Qfg5u_YAOQ3D_YK6ZmY3Qtc5P9Hpl2aaU6-HIunU7t6wnJeFtTK8M6JiboSU5BvK_eaf4XFt0LpGpfUBGzN8GaKyJHaf4Cw33K-J5y2p8Y707dhUxBH-gL4pE4JOyHJdVhGvq4coz_rFYBbQXUSahPVnbLRAV42Rp_-Tm__9Ok5Th8SckhB9SUTRulf5MRQv4duwtWHzSgQP39YEUkhhEvaOg3w1F9hQBfh5XeTzWQBcySfgPr0YPTvUaWbcZNwms9HNf-EfOo8JBAIhsT374qguCgbxitBOgoIaWLJ_hkivXDU-7s_B1WdPY_xgdsnhHUv8sazjXKHC6Cd374Ng"
    }

    

    /**
     * TODO: Probar la API de Auth
     * ? Opción para optener ACCESES_TOKEN con httpRequest que funciona
     *  https://accounts.google.com/o/oauth2/v2/auth?
     *  scope=https%3A//www.googleapis.com/auth/cloud-platform&
        include_granted_scopes=true&
        response_type=token&
        redirect_uri=https%3A//agentemii.firebaseapp.com/__/auth/handler&
        client_id=683912406589-acc9kkbnqu7qgao221kuk6aqanqli01b.apps.googleusercontent.com

        **El problema para tomar el valor del token

     * * Después se puede usar el token en el llamado
     * https://www.googleapis.com/drive/v2/files?access_token=access_token
     * 
     * * O se puede usar en headers
     * GET /drive/v2/files HTTP/1.1
     * Host: www.googleapis.com
     * Authorization: Bearer access_token
     * 
     */

    // console.log(accessToken)
    

    if (accessToken)
    {
      // this.authApi().subscribe(res => { console.log(res)})
      // await this.createProject(agente, accessToken).toPromise()
      return
      this._auth.user$.pipe().subscribe(async (user) => {
        // var user: UserInterface = authUser.user
    
        console.log(user)
        // Eliminar campos vacios
        Object.keys(agente).forEach(key => {
          if (agente[key] == '' || agente[key] == undefined) delete agente[key]
        })

        agente = { ...agente }
        console.log({ agente })


        // Guardado a Firestore
        const userRef = this.afs.collection('usuarios').ref.doc(user.uid)
        const agentesColl = userRef.collection('agentes')
        const agenteNuevo = await agentesColl.add(agente)

      
        // Transformar id para generar un string único
        // Juntar el nombre del agente sin espacios más 6 dígitos del ID generado
        // por el Firebase
        var sufixId = agente.displayName.split(' ').join('-')
        var codeId = agenteNuevo.id.slice(0, 6)


        agente['agenteId'] = `${sufixId}-${codeId}`
        console.log({ agenteId: agente.agenteId })
    

        this.waitFor(5000)
        

        // * Espera la creación del proyecto
        // await this.createProject(agente).toPromise()

        // * Crear el agente
        await this.createAgent(agente).subscribe(() => {
          console.log('creado')
        })
        
      })
    } else {
      console.log('no se autenticó')
    }
      

  }

  
  
  
  
  
  // ? Crear proyecto
  createProject(agente?: AgenteModel, token?): Observable<any>{

    console.log( 'creando proyecto' )
    var access_token = localStorage.getItem('googleTokens')

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })

    

    // * Asignar datos del proyecto
    const body = {
      "name": 'agenteNuevo',
      "projectId": 'agenteNuevo1234',
      "labels": {
        "agenteMii": 'prueba'
      }
    }


    return this._http.post(`https://cloudresourcemanager.googleapis.com/v1/projects`,
      body,
      { headers: headers }
    )
  }



  // ? Crear Agente
  createAgent(agente: AgenteModel): Observable<any> {


    // * Asignar datos del agente
    const parent = `${agente.displayName}-${agente.agenteId}`
    const body = {
      "displayName": agente.displayName,
      "parent": parent,
      "defaultLanguageCode": agente.defaultLanguageCode,
      "timeZone": agente.timeZone,
      "description": agente.description,
      "avatarUri": agente.avatarUri,
      "enableLogging": true,
      "matchMode": 'MATCH_MODE_HYBRID',
      "classificationThreshold": 0.3,
      "apiVersion": 'API_VERSION_V2',
    }


    
    // * Crear el agente de dialogflow
    return this._http.post(`https://dialogflow.googleapis.com/v2/projects/${parent}`, body)


  }


  
  

}


