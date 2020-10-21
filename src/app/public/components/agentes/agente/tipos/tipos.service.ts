import { AlertService } from 'src/app/Gdev-Tools/alerts/alert.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Loading } from '../../../../../Gdev-Tools/loading/loading.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { CacheService } from '../../../../../Gdev-Tools/cache/cache.service';
import { CurrentAgenteService } from '../current-agente.service';
import { TipoEntidadModel, Clase } from './tipo.model';
import { TextService } from '../../../../../services/text.service';
import { Subject, Observable, AsyncSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TiposService {

  tiposPath: string
  // tiposList: TipoEntidadModel[]
  tiposList$ = new Subject<TipoEntidadModel[]>()
  // currentTipo: TipoEntidadModel
  currentClases: Clase[]

  private _url = 'https://us-central1-main-agentesmart.cloudfunctions.net/dialogflow/entity';
  private _projectId: String;

  constructor (
    private loading: Loading,
    private fs: AngularFirestore,
    private _cache: CacheService,
    private _agente: CurrentAgenteService,
    private _text: TextService,
    private router: Router,
    private _http: HttpClient,
    private _alerts: AlertService
  ) {
    this.tiposCollection()
    this.resetCurrentTipo()
    this._projectId = this._cache.getDataKey('projectId');
  }
  
  resetCurrentTipo() {
    this.currentClases = []
  }


  async tiposCollection() {
    this.tiposPath = await this._agente.getPath( 'tipos' )
    const tiposRef = this.fs.collection( this.tiposPath ).ref
    return tiposRef
  }


  // CREATE TIPOS DE DATOS
  // REVIEW POST /entity

  private _postCreateEntity(entityType: TipoEntidadModel): Promise<TipoEntidadModel>{
    // NOTE POST /entity Necesitas enviar un entityType valido
    // LINK https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2.IEntityType.html
    return new Promise((resolve, reject) => {
      this._http.post(this._url, entityType, {
        responseType: "json"
      })
        .toPromise()
        .then(result => {
          console.info("Entity POST Response:", result);
          if (result['status'] == 201 || result['status'] == 201) {
            //exito creado
          }
          resolve(result['result'])
        })
        .catch(err => {
          if (err) {
            this._alerts.sendError('No fué posible crear ese Tipo en este momento. Intentelo de nuevo porfavor.', err)
          }
          reject(err)
        })
    })
  }
  // UPDATE
  // REVIEW  PUT /entity 
  // send a valid EntityType with a Resource name.

  private _putEntityRequest(entityType: TipoEntidadModel) {
    return new Promise((resolve, reject) => {
      this._http.put(this._url, entityType)
       .toPromise()
        .then(result => {
          console.info("Entity PUT Response:", result);
          if (result['status'] == 201) {
            //exito creado
            resolve(result)
          }
        })
        .catch(err => {
          if (err) {
            this._alerts.sendError('No fué posible crear ese Tipo en este momento. Intentelo de nuevo porfavor.', err)
          }
          reject(err)
        })
    })
  }

  async setTipo( tipo: TipoEntidadModel ) {
    tipo.displayName = this._text.normalize( tipo.displayName )
    const tipoInList: number = this._agente.tiposList.findIndex( Tipo => Tipo.name === tipo.name )
    Object.keys(tipo).forEach(key => { if (tipo[key] == undefined) delete tipo[key]})
    
    if ( tipoInList < 0 ) {
      let newTipo = await ( await this.tiposCollection() ).add( {...tipo} )
      tipo.name = newTipo.id
      newTipo.update( { name: newTipo.id } )
    } else {
      await ( await this.tiposCollection() ).doc( tipo.name ).set( { ...tipo }, { merge: true } )
    }
    // this.router.navigateByUrl( '../', { skipLocationChange: true } )
    //   .then(()=> this.router.navigate(['tipos']))
    return tipo.name
  }


  async setTipoOption(
    tipoName: string,
    option: 'kind' | 'autoExpansionMode' | 'enableFuzzyExtraction',
    value: string | boolean
  ) {
    await (await this.tiposCollection()).doc(tipoName).update({[option]: value})
  }


  async setClase(tipoName: string, clase: Clase) {
    const tipoDoc = await ( await this.tiposCollection() ).doc( tipoName ).get()
    const current = tipoDoc.data() as TipoEntidadModel
    const clasesList = current.entities
    const claseIndex = clasesList.findIndex( cla => cla.value === clase.value )
    
    if ( claseIndex >= 0 ) {
      clasesList[ claseIndex ] = clase
    } else {
      clasesList.push( clase )
    }

    await ( await this.tiposCollection() ).doc( tipoName ).update( { entities: clasesList } );
    return 
  }

  async setSinonimo( tipoName, claseValue: string, sinonimo: string, action: 'add' | 'del' ) {
    const tipoDoc = await ( await this.tiposCollection() ).doc( tipoName ).get()
    const current = tipoDoc.data() as TipoEntidadModel
    const clasesList = current.entities
    const claseIndex = clasesList.findIndex( clase => clase.value === claseValue )

    if ( action == 'add' ) {
      if ( !clasesList[ claseIndex ].synonyms ) {
        clasesList[ claseIndex ]['synonyms'] = []
      }
      clasesList[ claseIndex ].synonyms.push(sinonimo)
    } else {
      const sinoIndex = clasesList[ claseIndex ].synonyms
        .findIndex( sino => sino == sinonimo )
      clasesList[claseIndex].synonyms.splice(sinoIndex, 1)
    }


    await ( await this.tiposCollection() ).doc( tipoName ).update( { entities: clasesList } );
    return 

  }





  // READ TIPOS DE DATOS
  // REVIEW LIST ALL EntityTypes
  //creo este metodo es silimar al de abajo
  private getAllEntities(){
    return this._http.get(`${this._url}/${this._projectId}`)
  }

  currentTipo$ = new Observable<TipoEntidadModel>()
  // currentTipo: TipoEntidadModel
  

  // async get() {
  //   this.tiposList = []
  //   const tiposCol = await ( await this.tiposCollection() ).orderBy('displayName', 'asc').get()
  //   if ( tiposCol.size > 0 ) {
  //     await this.loading.asyncForEach(
  //       tiposCol.docs, async tipo => {
  //         return this.tiposList.push(tipo.data())
  //       }
  //     )
  //   }
  //   return this.tiposList
  // }


  currentTipo( name?: string ): TipoEntidadModel {
    return name
      ? this._agente.tiposList.find(t => t.name == name)
      : new TipoEntidadModel( '', '', 'KIND_LIST', 'AUTO_EXPANSION_MODE_DEFAULT', this.currentClases, false )
  }


  // REVIEW
  // DELETE review Delete De EntityType
  private _deleteEntityType(entityId: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this._http.delete(this._url + `/${this._projectId}/${entityId}`)
        .toPromise()
        .then(result => {
          if (result['status'] == 204) {
            resolve('done');
          }
        })
        .catch(err => {
          if (err) {
            this._alerts.sendError('No es posible elimnar intent, intentelo de nuevo, porfavor.', err)
          }
          reject(err)
        })
    })
  }



  async deleteTipo( tipoName: string ) {
    await ( await this.tiposCollection() ).doc( tipoName ).delete()
    return 
  }

  
  async deleteClase( tipoName: string, claseValue: string,  ) {
    const tipoDoc = await ( await this.tiposCollection() ).doc( tipoName ).get()
    const current = tipoDoc.data() as TipoEntidadModel
    const clasesList = current.entities
    const claseIndex = clasesList.findIndex( clase => clase.value === claseValue )
    if ( claseIndex >= 0 ) {
      clasesList.splice(claseIndex, 1)
    }

    await ( await this.tiposCollection() ).doc( tipoName ).update( { entities: clasesList } );
    return 

  }


}
