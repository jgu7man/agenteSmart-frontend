import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GdevLoading } from 'src/app/gdev-tools/src/lib/loading/loading.service';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { GdevCache } from 'src/app/gdev-tools/src/lib/cache/gdev-cache.service';
import { TipoEntidadModel, SystemEntitieModel } from './tipo.model';
import { GdevText } from 'src/app/services/text.service';
import { Subject, Observable, of, zip } from 'rxjs';
import { map, tap, flatMap } from 'rxjs/operators';
import { AuthService } from 'src/app/admin/auth/auth.service';
import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';
import { environment } from 'src/environments/environment';
import { ContextoModel } from '../contextos/contexto.model';
import { GdevColor } from 'src/app/gdev-tools/src/lib/color/gdev-color.service';
import { SystemEntitiesService } from 'src/app/admin/system/system-entities.service';

@Injectable({
  providedIn: 'root',
})
export class TiposService {
  /** Almacena la ruta del proyecto actual a la collection de tipos  */
  private tiposPath: string;
  /** Almacena la ruta a los intent */
  private agentePath: string;
  /** Obtine y almacena la ruta a la API */
  private _url = environment.restURL + 'entity';
  /** Almacena el id del proyecto del caché */
  private projectId: String;
/** Lista observable de los tipos */
  public list$:  Observable<(TipoEntidadModel | SystemEntitieModel)[]>;

  // private listSubs: Subscription;

  constructor(
    private _loading: GdevLoading,
    private _afs: AngularFirestore,
    private _cache: GdevCache,
    private _text: GdevText,
    private _http: HttpClient,
    private _auth: AuthService,
    private _alerts: GdevAlert,
    // private store: Store<AppState>,
    private _color: GdevColor,
    private _systemEntites: SystemEntitiesService,
  ) {
    this.projectId = this._cache.getDataKey('projectId');
  }

  /** Define la ruta de firestore */
  public tiposCollection(): CollectionReference<TipoEntidadModel> {
    this.agentePath = this._cache.getDataKey('agentePath');
    this.tiposPath = `${this.agentePath}/tipos`;
    const tiposRef = this._afs.collection<TipoEntidadModel>(this.tiposPath).ref;
    return tiposRef;
  }

  private contextosCollection():CollectionReference<ContextoModel> {
    this.agentePath = this._cache.getDataKey('agentePath');
    const contextosRef = this._afs.collection<ContextoModel>(`${this.agentePath}/contextos`).ref;
    return contextosRef;
  }

  // CREATE TIPOS DE DATOS

  // # $CREATE TIPO
  /** Prepara la entity para ser creada en el backend, obtiene el ID:name y guarda los datos en firestore */
  public async createTipo(tipo: TipoEntidadModel) {
    // GdevLoading animation
    this._loading.toggleWaitingSpinner('open');
    // Prepare name
    let projectId = this._cache.getDataKey('projectId');
    tipo.displayName = this._text.normalize(tipo.displayName);
    // clean object
    Object.keys(tipo).forEach((key) => {
      if (tipo[key] == undefined) delete tipo[key];
    });
    // search for duplicated
    const tipoList = this._cache.getDataKey<TipoEntidadModel[]>('tipos');
    const tipoInList: number = tipoList.findIndex(
      (Tipo) => Tipo.displayName === tipo.displayName
    );

    if (tipoInList < 0) {
      console.log('nueva entity');
      // create enriry API
      let newEntity = await this._postCreateEntity({ ...tipo });
      console.log(newEntity);
      // Get clean entity Id
      const resourceID = newEntity.name.slice(
        newEntity.name.lastIndexOf('/') + 1
      );
      const newTipo = { ...tipo, name: newEntity.name };

      // Save tipo in firestore
      await this.tiposCollection().doc(resourceID).set(newTipo);
      // this.store.dispatch(actions.addTipo({ tipo: newTipo }));

      this._loading.toggleWaitingSpinner('close');
      return newTipo;
    } else {
      this._alerts.sendMessageAlert('No es posible crear entidades duplicadas');
    }
  }

  /** Crea el entity en el backend */
  private _postCreateEntity(
    entityType: TipoEntidadModel
  ): Promise<TipoEntidadModel> {
    // NOTE POST /entity Necesitas enviar un entityType valido
    // LINK https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2.IEntityType.html
    console.log({ entityType: { ...entityType } });
    return new Promise((resolve, reject) => {
      this._http.post(
          `${this._url}/${this.projectId}`,
          { entityType: { ...entityType } },
          { responseType: 'json' }
        ).toPromise()
        .then((result) => {
          console.info('Entity POST Response:', result);
          if (result['status'] == 200 || result['status'] == 201) {
            //exito creado
          }
          resolve(result['result']);
        })
        .catch((err) => {
          if (err) {
            console.error(err);
            this._loading.toggleWaitingSpinner('close');
            this._alerts.sendError(
              'No fué posible crear ese Tipo en este momento. Intentelo de nuevo porfavor.',
              err
            );
            this.closeCreateDialog.next();
          }
          reject(err);
        });
    });
  }

  // # CLOSE "CREATE DIALOG"
  /** Escucha cunado el Dialog de creado de entity es cerrado */
  public closeCreateDialog: Subject<any> = new Subject();




  // REVIEW Probablemente no lo necesitemos
  async createTipoContextos(tipo: TipoEntidadModel) {
    // GdevLoading animation
    this._loading.toggleWaitingSpinner('open');
    // Prepare name
    tipo.displayName = this._text.normalize(tipo.displayName);
    // clean object
    Object.keys(tipo).forEach((key) => {
      if (tipo[key] == undefined) delete tipo[key];
    });

    // Create entity in dialogflow
    let newEntity = await this._postCreateEntity({ ...tipo });
    console.log(newEntity);

    // Create entity in firestore
    const resourceID = newEntity.name.slice(
      newEntity.name.lastIndexOf('/') + 1
    );
    const newTipo = { ...tipo, name: newEntity.name };
    await (await this.tiposCollection()).doc(resourceID).set(newTipo);

    // create contexts
    await this._loading.asyncForEach(
      newEntity.entities,
      async (entity, index) => {
        this.saveContext(entity, index);
      }
    );

    this._loading.toggleWaitingSpinner('close');
  }

  // REVIEW No debería estar en ContextosService?
  async saveContext(entity, index) {
    let contexto: ContextoModel = {
      contextName: entity.value,
      lifespanCount: 3,
      index: index,
      color: this._color.generateHSLcolor(50, 50),
    };

    Object.keys(contexto).forEach((key) => {
      if (contexto[key] == undefined) delete contexto[key];
    });

    // Agrega contexto nuevo
    let contextNuevo = await (await this.contextosCollection()).add(contexto);
    contextNuevo.update({ id: contextNuevo.id });
    contexto.id = contextNuevo.id;
  }


  // $READ TIPOS DE DATOS
  /** GET TIPOS LIST Retorna la lista completa de entidades del agente y las entidades de sistema */
  getTiposList(): Observable<(TipoEntidadModel | SystemEntitieModel)[]> {
    if (!this.list$) {
      this.list$ = this._cache.listenForChanges<TipoEntidadModel[]>('tipos')
    }
    const path = this._cache.getDataKey('agentePath')
    return this.getAllEntities().pipe(
      tap((list) => {
        this._cache.updateData('tipos', list)
      }),
      // flatMap(() => this._afs
      //   .collection<TipoEntidadModel>(path + "/tipos")
      //   .valueChanges()),
      flatMap(() => of(this._systemEntites.systemEntities)
        .pipe(tap((syslist) => this._cache.updateData('sysTipos', syslist))))
    )

    // var system =

  }


  // # GET ALL ENTITIES From backend
  /** Toma entities del backend */
  public getAllEntities(): Observable<any> {
    this.projectId = this._cache.getDataKey( 'projectId')
    return this._http.get(`${this._url}/${this.projectId}`)
      .pipe(
        map(response => {
          if (response['status'] === "Success")
            return response['result']
          else console.error("Error al cargar los entityTypes")
        }),
        tap((list: TipoEntidadModel[]) => {
          list.forEach(t => {
            let tipoId = t.name.slice(t.name.lastIndexOf('/') + 1)
            this.tiposCollection().doc(tipoId).set(t, {merge: true})
          })
        })
      )
  }


  // # GET BY NAME
  /** Toma una entity basado en el name */
  public getByName(name: string) {
    const tiposList = this._cache.getDataKey<TipoEntidadModel[]>('tipos');
    return tiposList.find((t) => t.name == name);
  }

  // # GET BY DISPLAYNAME
  /** Toma una entity basado en el displayName */
  public async getByDisplayName(displayName: string) {
    let list = await this._cache.getDataKey<TipoEntidadModel[]>('tipos');
    return list.find((t) => t.displayName == displayName);
  }

  /** Está pendiendte de la entity seleccionada en el storage */
  // getCurrentTipo$() {
  //   return this.store.select('tipos').pipe(
  //     map((tipos) => {
  //       // console.log(tipos);
  //       let selected = tipos.find((t) => t.selected == true);
  //       return selected;
  //     })
  //   );
  // }

  /** Regresa como promesa la entity que se abrió en el panel. Se suscribe en tipo.compoenent.ts */
  // getCurrentTipo() {
  //   this.currentTipoSubs = this.getCurrentTipo$().subscribe(this.currentTipo$);
  // }



  /** Elimina la entity en el backend */
  private _deleteEntityType(entityId: string): Promise<any> {
    return new Promise((resolve, reject) => {

      console.log({ projectId: this.projectId, entityId });

      this._http
        .delete(this._url + `/${this.projectId}/${entityId}`)
        .toPromise()
        .then(() => {
          resolve('done');
        })
        .catch((err) => {
          if (err) {
            let error = err.error.error;
            console.log(error);
            if (error.code === 3) {
              this._alerts.sendMessageAlert(
                'Este tipo de datos es usado en el flujo, no puede ser eliminado'
              );
            } else {
              this._alerts.sendError(
                'No es posible elimnar intent, error desconocido.',
                err
              );
            }
          }
          reject(err);
        });
    });
  }

  // # DETELTE ENTITY TYPE
  /** Elimina la entity en firestore y backend */
  async deleteTipo(tipoName: string) {
    this._loading.toggleWaitingSpinner('open');
    const currentId = tipoName.slice(tipoName.lastIndexOf('/') + 1);
    await this._deleteEntityType(currentId);
    await (await this.tiposCollection()).doc(currentId).delete();
    this._alerts.sendFloatNotification(
      'Exito elimando ese tipo de dato.',
      'ok',
      5000,
      'bottom',
      'left'
    );
    this._loading.toggleWaitingSpinner('close');
    return;
  }



  unsubscribe() {
    // this.currentTipoSubs.unsubscribe();
    // this.listSubs.unsubscribe();
  }
}
