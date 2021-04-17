import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrentAgenteService } from '../../current-agente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IntentModel, ParametroMensaje } from '../mensaje.model';
import { Subject, Subscription, forkJoin, Observable, BehaviorSubject, of } from 'rxjs';
import { GdevLoading } from '../../../../../../gdev-tools/src/lib/loading/loading.service';
import { map, pluck, tap, debounceTime, flatMap, filter, take } from 'rxjs/operators';
import { GdevCache } from '../../../../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { RespuestaModel } from './entrenamiento/respuestas/respuesta.model';
import { GdevAlert } from '../../../../../../gdev-tools/src/lib/alert/alert.service';
import { Store } from '@ngrx/store';
import { MensajeState } from '../mensaje.model';
import * as actions from './store/mensaje.actions';
import { GdevCommonsService } from '../../../../../../gdev-tools/src/lib/common/services/gdev-commons.service';
import { Location } from '@angular/common';
import { environment } from '../../../../../../../environments/environment';
import { MensajesService } from '../mensajes.service';
import { SystemEntitieModel, TipoEntidadModel } from '../../tipos/tipo.model';

@Injectable({
  providedIn: 'root',
})
export class CurrentMensajeService {
  emptyIntent = {
    trainingPhrases: [],
    contextos:[],
    inputContextNames: [],
    outputContexts: [],
    parameters: [],
  }
  /** Informa cuando el intent actual ha cambiado */
  public current$: BehaviorSubject<IntentModel> = new BehaviorSubject(this.emptyIntent);
  /** Contiene el intent actual y sus cambios */
  // public current: IntentModel;
  /** Contiene el nombre del contexto actual */
  public currentContexto: string;
  /** Suscripción a los parámetros de la ruta activa */
  private paramSubs: Subscription;
  /** Contiene el nombre del intent actual */
  private intentName: string;
  /** Contiene la ruta de FIRESTORE del mensaje actual */
  private mensajesPath: string;
  /** Contiene la ruta a la API */
  private _url = environment.restURL + 'intent';
  private intentListSubs: Subscription;
  private intentList$: Observable<IntentModel[]>;
  respuestasSubs: Subscription;
  respuestasList$: BehaviorSubject<RespuestaModel[]> = new BehaviorSubject([]);
  currentSubscription: Subscription


  constructor(
    private fs: AngularFirestore,
    private _loading: GdevLoading,
    private store: Store<MensajeState>,
    private _agente: CurrentAgenteService,
    private _cache: GdevCache,
    private _alerts: GdevAlert,
    private _http: HttpClient,
    private _commons: GdevCommonsService,
    private _router: Router,
    private _location: Location,
    private _mensajes: MensajesService
  ) {
    // this.current$.subscribe(mensaje => console.log(mensaje))
  }

  /** Returna como promesa la referencia a FIRESTORE directa a la colección de los mensajes del usuario y del agente
   * @return {*} Referencia de firestore
   */
  public mensajesCollection() {
    const agentePath = this._cache.getDataKey('agentePath');
    this.mensajesPath = `${agentePath}/mensajes`;
    const mensajesRef = this.fs.collection(this.mensajesPath).ref;
    return mensajesRef;
  }

  /**
   * Obtiene los parámetros de la ruta cuando se ingresa a editar un mensaje
   * @return {*} Obserbavle con variable 'mensajeName' y 'currentContexto'
   */
  private getParams() {
    return forkJoin({
      ['mensajeName']: this._loading.getRouteParams().pipe(pluck('name')),
      ['currentContexto']: this._loading
        .getRouteQueryParams()
        .pipe(pluck('contexto')),
    });
  }


  /** Establece en el storage el intent actual y emite un evento para current$ */
  async setCurrent(displayNameOname: string, contexto?: string) {
    const agentePath = this._cache.getDataKey('agentePath');
    this.mensajesPath = `${agentePath}/mensajes`;

    this.currentContexto = contexto
    this.intentName = displayNameOname
    this._cache.updateData('currentContexto', this.currentContexto);
    of(this._cache.getDataKey('intents')).pipe(
      tap((data)=> console.log( data )),
      map(() => this.findIntent(displayNameOname)),
      tap((mensaje) => {
        this.findIntent(displayNameOname)
        this.current$.next(mensaje)
        this.getMensajeTipos(mensaje.parameters)
      }),
      flatMap((mensaje) => this.getRespuestasList(mensaje.name))
    ).subscribe(data => {
      console.log('mensaje loaded')
    })


  }

  findIntent(displayNameOname: string) {
    // console.log( displayNameOname )
    const list = this._cache.getDataKey<IntentModel[]>('intents')
    const projectId: string = this._cache.getDataKey('projectId');

    let intent = list.find((intent) =>
      intent.displayName == displayNameOname || intent.name == displayNameOname
    )

    if (!intent) {
      this._alerts.sendFloatNotification(
        'Error al cargar el intent. Parece que fue eliminado'
        );
      this._router.navigate([`/dashboard/agente/${projectId}/mensajes`]);
    } else {
      return intent

    }
  }


  /**
   * Busca en la lista de intents del storage un intent que coincida con el parámetro displayName
   *
   * @param {string} nameOrDisplayName displayName del intent o name.
   * Busca a través de ambos
   * @returns {IntentModel | null} intent completo si existe, si no, retorna null
   */
  async findMensaje(nameOrDisplayName: string) {
    let list = await this._cache.getAsyncKey<IntentModel[]>('intents');
    // console.log('lista de mensajes',  list);
    let intent = list.find((m) => m.displayName == nameOrDisplayName);
    if (!intent) intent = list.find((m) => m.name == nameOrDisplayName);
    // console.log(intent);
    return list ? (intent ? intent : null) : null;
  }


  /**
   * Se suscribe a los cambios de FIRESTORE para obtener las respuestas del intent actual y estble la variable de respuestasList con la lista actualizada. También inserta la lista de respuestas en el storage
   *
   * @returns {RespuestaModel} Array de respuestas actualizado
   */
  getRespuestasList(mensajeName: string) {

    const agentePath = this._cache.getDataKey('agentePath');
    const respuestasPath = `${agentePath}/mensajes/${mensajeName}/respuestas`;
    this._cache.listenForChanges<RespuestaModel[]>('currentRespuestas')
      .pipe(filter(response => !!response))
    .subscribe(data => {this.respuestasList$.next(data)})

    return this.fs
      .collection<RespuestaModel>(respuestasPath)
      .valueChanges().pipe(
        map((respuestas) =>
          this._commons.sortBy<RespuestaModel>(respuestas, 'index')),
        tap((respuestas) =>
          this._cache.updateData('currentRespuestas', respuestas)),
      )


  }

  mensajeTypeEntities$: BehaviorSubject<
    (TipoEntidadModel | SystemEntitieModel)[]
  > = new BehaviorSubject([]);
  /** Obtiene los tipos de datos del mensaje actual
   * @return {array} Arreglo de los tipos de datos del mensaje actual
   */
   async getMensajeTipos(paramList: ParametroMensaje[]) {
    const tipos = await this._cache.getAsyncKey<any[]>('tipos')
    const sysTipos = await this._cache.getAsyncKey<any[]>('sysTipos')
    const allTipos: (TipoEntidadModel | SystemEntitieModel)[] = tipos.concat(sysTipos)

    const entities = this.mensajeTypeEntities$.getValue();
    paramList.forEach((param) => {
      let splited = param.entityTypeDisplayName.split('@')
      let paramEntity = splited[1]
      if( paramEntity !== undefined){
        let tipoStored: TipoEntidadModel | SystemEntitieModel = entities.find(
          (t) => t && t.displayName == paramEntity
        );
        // console.log(tipoStored)
        if (!tipoStored || tipoStored === undefined) {
          tipoStored = allTipos.find(t => t.displayName == paramEntity)
          this.mensajeTypeEntities$.next([
            ...this.mensajeTypeEntities$.getValue(),
            tipoStored,
          ]);
        }
      }
    });

    return this.mensajeTypeEntities$;
  }

  // UPDATE MENSAJE ACTUAL
  // mensajeUpdated$: Subject<any> = new Subject()
  /** Actualiza el intent actual en DIALOGFLOW con los cambios hechos en el área de entrenamiento. */
  async update() {
    this._loading.toggleWaitingSpinner('open');

    try {
      // Update current mensaje
        const current = this.current$.getValue()

        if (current.name.includes('/')) {
          current.name = current.name.slice(
            current.name.lastIndexOf('/') + 1
          )
        }

        const request = await this.updateIntentApiRequest(current);
        console.log(request);
        if (request) {
          // console.info('Se Actualizo Intent:', request);
          this._mensajes.getDialogFlowIntents()
            .pipe(take(1))
            .subscribe(() => {
              console.log( 'changes' )
              this.setCurrent(request.displayName)

            });

          this.store.dispatch(actions.setSaved());
          this._alerts.sendFloatNotification('Guardado');
          this._loading.toggleWaitingSpinner('close');

          // return this.mensajeUpdated$.next()
        } else {
          this._alerts.sendMessageAlert('No se pudo guardar')
        }



        return;

    } catch (error) {
      console.error(error);
      this._alerts.sendError('No se pudo guardar', error);
      this._loading.toggleWaitingBar();
    }
  }

  /** Actualiza el intent actual en DIALOGFLOW a través de la API
   * @private
   * @param {IntentModel} intent
   * @returns {*}  {Promise<IntentModel>}
   */
  private updateIntentApiRequest(intent: IntentModel): Promise<IntentModel> {
    let projectId = this._cache.getDataKey('projectId');
    let path = `projects/${projectId}/agent/intents/${intent.name}`;
    intent.name = path;
    const body = {
      intent,
      intetnView: 'INTENT_VIEW_FULL',
    };

    const headers = { responseType: 'json' };

    return new Promise((resolve, reject) => {
      this._http
        .put(this._url, body, { headers })
        .toPromise()
        .then((response) => {
          if (response) {
            console.info('Intent Actualizado:', response);
            resolve(response['intent']);
          }
        })
        .catch((err) => {
          if (err) {
            console.error(err);
          }
          reject(err);
        });
    });
  }

  /**
   * Elimina el intent en DIALOGFLOW y después en FIRESTORE
   *
   * @param {string} mensajeName name del intent
   * @returns {*}
   */
  async delete(mensajeName: string) {
    //params intentName (ultima cadena)
    // REVIEW Falta testear esta función.
    const projectId: string = this._cache.getDataKey('projectId');
    const request = await this.deleteIntentRequest(mensajeName);
    if (request) {
      console.log(mensajeName);
      await (await this.mensajesCollection()).doc(mensajeName).delete();
      await this._router.navigateByUrl(`/dashboard`, {
        skipLocationChange: true,
      });
      this._router.navigate([`/dashboard/agente/${projectId}/mensajes`]);
    }

    return;
  }

  /**
   * Elimina el intent desde la API
   * @private
   * @param {string} intentId
   * @returns {*}  {Promise<any>}
   */
  public deleteIntentRequest(intentId: string): Promise<any> {
    this._loading.toggleWaitingSpinner('open');
    return new Promise((resolve, reject) => {
      const projectId: string = this._cache.getDataKey('projectId');

      this._http
        .delete(this._url + `/${intentId}/project/${projectId}`)
        .toPromise()
        .then((response) => {
          resolve(true);
        })
        .catch((err) => {
          if (err) {
            console.log(err);
            this._alerts.sendError(
              'No es posible elimnar intent, intentelo de nuevo, porfavor.',
              err
            );
          }
          // reject(true);
        });
    });
  }

  /** Desuscribe todos los datos en este servicio */
  unsubscribe() {
    // if (this.currentSubscription) this.currentSubscription.unsubscribe()
    this.store.dispatch(actions.getOutMensaje());
    this._cache.deleteDataKey('currentIntent');
    this._cache.deleteDataKey('currentRespuestas');
    this.current$.next(this.emptyIntent)
    if (this.respuestasSubs) {
      this.respuestasSubs.unsubscribe();
    }
    if (this.intentListSubs) {
      this.intentListSubs.unsubscribe();
    }
    if (this.paramSubs) this.paramSubs.unsubscribe();
    // console.log('unsubscribe');
  }
}
