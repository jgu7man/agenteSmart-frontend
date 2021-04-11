import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GdevLoading } from 'src/app/gdev-tools/src/lib/loading/loading.service';
import { GdevCache } from 'src/app/gdev-tools/src/lib/cache/gdev-cache.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { GdevText } from '../../../../../services/text.service';
import { CurrentAgenteService } from '../current-agente.service';
import { ContextoModel } from '../contextos/contexto.model';
import { GdevAlert } from '../../../../../gdev-tools/src/lib/alert/alert.service';
import { of, Subject, BehaviorSubject, Observable } from 'rxjs';
import { IntentModel, MensajeModel } from './mensaje.model';
import { filter, flatMap, map, pluck, tap } from 'rxjs/operators';
import { RespuestaModel } from './mensaje/entrenamiento/respuestas/respuesta.model';
import { CurrentMensajeService } from './mensaje/current-mensaje.service';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/app';
import { AgenteModel } from '../../init-agente/agente.model';

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
  /** Almacena la ruta de los mensajes, incluyendo ID de usuario y de proyecto */
  private mensajesPath: string;
  /** Almacena el ID del proyecto actual */
  private projectId;
  /** Motiva a recargar los mensajes */
  // reloadMensajes$ = new Subject<any>();
  /** Almacena la URL para consultas de la API */
  private _url = environment.restURL + 'intent';

  public list$: Observable<IntentModel[]>

  constructor(
    private _http: HttpClient,
    private fs: AngularFirestore,
    private _cache: GdevCache,
    private _alerts: GdevAlert,
    private _loading: GdevLoading,
    private _text: GdevText,
    // private _current: CurrentMensajeService,
    private _router: Router
  ) {
    this.projectId = this._cache.getDataKey('projectId')
  }

  /** Obtine la referencia actual a FIRESTORE para los mensjaes */
  mensajesCollection<T>() {
    this.mensajesPath = `${this._cache.getDataKey('agentePath')}/mensajes`;
    const mensajesRef = this.fs.collection<T>(this.mensajesPath);
    return mensajesRef;
  }




  // SECTION CRUD de mensajes

  // $CREATE Mensajes

  // # CREATE NEW INTENT IN DIALOGFLOW
  /** Crear un intent nuevo en DIALOGFLOW a través de la API
   *@param projectId id del projecto
   *@param intent displayname nombre del intent */
  createNewIntent(intent: IntentModel): Promise<IntentModel> {
    intent = {
      ...intent,
      webhookState: 'WEBHOOK_STATE_ENABLED_FOR_SLOT_FILLING',
    };

    const intentRequest = { projectId: this.projectId, intent };
    console.log(intentRequest);

    return new Promise<IntentModel>((resolve, reject) => {
      this._http
        .post(this._url, intentRequest, { responseType: 'json' })
        .subscribe(
          (intentCreated) => {
            console.log('IntentCreated:', intentCreated['intent']);
            resolve(intentCreated['intent']);
            this.getDialogFlowIntents();
          },
          (onError) => {
            // this._alerts.sendError('Algo falló', onError);
            reject(onError);
          }
        );
    });
  }

  // # SAVE NEW MENSAJE
  /** Agrega el intent nuevo creado por la API a dialogflow como referencia para la interfaz en FIRESTORE
   * @param {IntentModel} displayName intent creado por la API
   * @param {number} [index] index en el orden del contexto
   * @param {string} [contexto] contexto con el que será invocado en la interfaz
   */
  public async saveNewMensaje(
  displayName: string,
  index?: number,
  contexto?: string
  ) {
    this._loading.toggleWaitingSpinner('open');

    // Prepara los contextos
    const contextPath = `projects/${this.projectId}/agent/sessions/-/contexts/`
    var inputContextNames = [contextPath + nameContext]
    var nameContext = this._text.normalize(displayName).toLowerCase();
    nameContext = nameContext.replace(/\s/g, '');
    contexto = this._text.normalize(contexto).toLowerCase();
    if (contexto) inputContextNames.push( contextPath + contexto)

    try {
      const newIntent = await this.createNewIntent({
        displayName, inputContextNames
      });

      const resourceID = newIntent.name.slice(
        newIntent.name.lastIndexOf('/') + 1
      );

      let intent = {
        name: newIntent.name,
        displayName: newIntent.displayName,
      };

      console.log(intent);
      if (index) intent['index'] = index;
      intent['contexto'] = contexto ? contexto : 'no-context';

      console.log(`guardando intent en firestore: `, intent);
      await (await this.mensajesCollection()).ref.doc(resourceID).set(intent);
      this.getDialogFlowIntents();
      this._loading.toggleWaitingSpinner('close');
      await this._router
        .navigateByUrl('/dashboard/agentes', { skipLocationChange: true })
        .then(() => this._router.navigate([
            `/dashboard/agente/${this.projectId}/mensajes`,
          ])
        );
      this._alerts.sendFloatNotification('Mensaje creado')
      return


    } catch (error) {
      console.error(error);
      this._loading.toggleWaitingSpinner('close');
      if (error.error.code === 3) {
        this._alerts.sendError(
          'Este nombre de intent ya existe, por favor elige otro',
          error.error.error.details
        );
      } else if (error.error.code === 9) {
        this._alerts.sendError(
          'El nombre del intent no sólo puede contener caracteres como LETRAS: [a-z, A-Z], números:[0-9], guión bajo [_], guión medio [-] o espacios',
          error.error.error.details
        );
      } else {
        this._alerts.sendError('Error', error.error.error.details);
      }
    }
  }

  // !$CREATE




  // # SET CONTEXT TO CONTEXT INTENT
  /**
   * Setea el contexto nuevo al intent de contextos como un
   * parámetro y una frase de entreamiento más.
   * @param {string} context
   */
  setContextMensaje(context: string) {
    const intentList = this._cache.getDataKey<IntentModel[]>( 'intents' )
    const contextIntent = intentList.find(
      (i) => i.displayName === 'Default Context Intent'
    );

    contextIntent.parameters.push({
      defaultValue: context,
      displayName: context,
      entityTypeDisplayName: context,
      isList: false,
      mandatory: false,
      value: context,
    });

    contextIntent.trainingPhrases.push({
      parts: [
        {
          alias: context,
          entityType: '@contextos',
          text: context,
          userDefined: true,
        },
      ],
      type: 'EXAMPLE',
    });

    // console.log(contextIntent)
    // this._current.update(contextIntent);
  }

  // $READ MENSAJES
  // Se obtienen los intents configurados en dialogflow y se almacenan en caché

  intializeMensajes() {
    this._cache.listenForChanges<AgenteModel>('currentAgente')
      .pipe(filter(agente => !!agente),
        flatMap(() => this._cache.listenForChanges('intents')),
        // flatMap(() =>)
      )
  }

  // # GET DIALOGFLOW INTENTS
  /** Obtiene respuesta de los intents registrados en el agente de Dialogflow */
  getDialogFlowIntents(): Observable<IntentModel[]> {
    this.list$ = this._cache.listenForChanges<IntentModel[]>('intents')
    .pipe(filter(list => !!list))
    const projectId: string = this._cache.getDataKey('projectId');

    return this._http.get<IntentModel[]>(
    `${this._url}/${projectId}`,
    { responseType: 'json' }
    ).pipe(
        pluck<any, IntentModel[]>('result', 'intents'),
        map<IntentModel[], IntentModel[]>((list) => {
          return list.map((intent) => {
            intent.name = intent.name.slice(intent.name.lastIndexOf('/') + 1);
            return intent;
          });
        }),
        tap((list) => this._cache.updateData('intents', list))
      );
  }

  // # MENSAJES LIST BY CONTEXT
  /** Observable de la lista de mensajes filtrados por contexto en firebase */
  mensajesListByContext$: BehaviorSubject<MensajeModel[]> = new BehaviorSubject(
    []
  );

  // # GET MENSAJES LIST BY CONTEXTO
  /** Obtiene los Mensajes de Firestore que coinciden con tener el contexto indicado
   * @param {ContextoModel} contexto Indica el contexto al cual pertenece la fila donde se invoca la lista de mensajes
   * @return {Observable<MensajeModel[]>} Regresa un array de mensajes pertenecientes al contexto
   */
  async getMensajesListByContexto(contexto: ContextoModel) {
    var mensajesList: MensajeModel[] = [];
    if (contexto.id) {
      const mensajeCol = await this.mensajesCollection().ref
        .where('contexto', '==', contexto.contextName)
        .get();
      await this._loading.asyncForEach(mensajeCol.docs, (mensaje) => {
        mensajesList.push(mensaje.data());
      });
    }
    return mensajesList;
  }

  async getMensajesWithoutContext() {
    var mensajesList: MensajeModel[] = [];
    const mensajeCol = await (await this.mensajesCollection()).ref
      .where('contexto', '==', 'no-context')
      .get();
    await this._loading.asyncForEach(mensajeCol.docs, (mensaje) => {
      mensajesList.push(mensaje.data());
    });
    return mensajesList;
  }

  private async validateMensajesList(
    mensajes: MensajeModel[]
  ): Promise<MensajeModel[]> {
    const list = this._cache.getDataKey<IntentModel[]>( 'intents' )
    if (list.length === mensajes.length) return mensajes;
    else {
      return mensajes.map((m) => {
        let finded = list.find((i) => i.displayName === m.displayName);
        if (finded) return finded;
        else {
          this.fs.collection(this.mensajesPath).doc(m.name).delete();
        }
      });
    }
  }

  // # GET NEXT MENSAJES BY ID
  /** Obtiene los mensajes siguientes del mensaje que solicita mediente su ID
   * @param {string} id Id del mensajes del cuál se solicita saber sus siguientes mensajes
   * @return {*} Array de mensajes siguientes del mensaes
   */
  getNextMensajes(id: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.fs
        .collection<RespuestaModel>(`${this.mensajesPath}/${id}/respuestas`)
        .valueChanges()
        .subscribe(async (respuestasCol) => {
          var following: string[] = [];
          if (respuestasCol.length > 0) {
            await this._loading.asyncForEach(respuestasCol, (respuesta) => {
              let resStored = following.findIndex(
                (r) => r == respuesta.nextIntent
              );
              if (resStored < 0) following.push(respuesta.nextIntent);
            });
          }
          return resolve(following);
        });
    });
  }
}
