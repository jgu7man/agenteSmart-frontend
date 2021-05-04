import { MensajeState } from './../../../mensaje.model';
import { IntentModel } from '../../../mensaje.model';
import { Injectable } from '@angular/core';
import { CurrentAgenteService } from '../../../../current-agente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  ParametroMensaje,
  FraseEntrenamiento,
  FraseParte,
} from '../../../mensaje.model';
import { CurrentMensajeService } from '../../current-mensaje.service';
import { Subject } from 'rxjs';
import { FrasesService } from '../frases-form/frases.service';
import { GdevLoading } from '../../../../../../../../gdev-tools/src/lib/loading/loading.service';
import { GdevAlert } from '../../../../../../../../gdev-tools/src/lib/alert/alert.service';
import { Store } from '@ngrx/store';
import * as actions from '../../store/mensaje.actions';
import { GdevColor } from '../../../../../../../../gdev-tools/src/lib/color/gdev-color.service';
import { GdevCache } from '../../../../../../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { TiposService } from '../../../../tipos/tipos.service';

@Injectable({
  providedIn: 'root',
})
export class ParametrosService {
  /** Ruta de los mensajes para actualizaciones */
  mensajesPath: string;
  /**Mensaje en curso */
  mensaje: IntentModel;
  /**Informa cuando un parámetro fue agregado en las frases de entrenamiento */
  public parameterAdded$: Subject<ParametroMensaje> = new Subject();
  /**Informa cuando un parte de frase de entrenamiento fue borrada y contenía algún parámetro */
  public parameterDeleted$: Subject<boolean> = new Subject();
  /**Escucha y actualiza la lista de parámetros del mensaje en curso */
  list$: Subject<ParametroMensaje[]> = new Subject();
  /**Lista siempre actualizada del Subject list$ */
  // list: ParametroMensaje[]

  constructor(
    private _agente: CurrentAgenteService,
    private _mensaje: CurrentMensajeService,
    private _frases: FrasesService,
    private _loading: GdevLoading,
    private _alerts: GdevAlert,
    private store: Store<MensajeState>,
    private _color: GdevColor,
    private fs: AngularFirestore,
    private _cache: GdevCache,
    private _tipos: TiposService
  ) {
    this.getFirestoredParams();
  }

  /** Obtiene constante actualizado la ruta del mensaje en curso para los métodos del CRUD */
  private async paramsCollection() {
    const agentePath = this._cache.getDataKey('agentePath');
    this.mensajesPath = agentePath + `/parametros`;
    const mensajesRef = this.fs.collection(this.mensajesPath).ref;
    return mensajesRef;
  }

  // CREATE Parametros

  async addParam(param: ParametroMensaje, example?: string) {
    // console.log(param);
    var parameters = this._mensaje.current$.getValue().parameters;
    var paramInList = parameters.find(
      (p) => p.displayName == param.displayName
    );

    if (!paramInList) {
      await (await this.paramsCollection()).doc(param.displayName).set(
        {
          displayName: param.displayName,
          color: this._color.generateBrightColor(),
        },
        { merge: true }
      );
    }

    if (!parameters || parameters.length == 0) {
      parameters = [param];
      console.log('params defined');
      console.log(parameters);
      // this.parameterAdded$.next(param);
    } else {
      parameters.push(param);
      console.log('params defined');
      // this.parameterAdded$.next(param);
    }
    this._mensaje.current$.next({
      ...this._mensaje.current$.getValue(),
      parameters,
    });

    console.log(param);
    return;
  }

  // READ PARAM
  getParamByName(displayName: string) {
    var paramSelected = this._mensaje.current$.getValue()
      .parameters.find(
      (p) => p.displayName === displayName
    );
    return paramSelected;
  }

  firestoredParams: any[] = [];
  async getFirestoredParams() {
    const agentePath = this._cache.getDataKey('agentePath');
    this.mensajesPath = agentePath + `/parametros`;
    this.fs
      .collection(this.mensajesPath)
      .valueChanges()
      .subscribe(async (list) => {
        this._cache.updateData('parametros', list);
        this.firestoredParams = await this._cache.getAsyncKey('parametros');
      });
  }

  getParamColor(displayName: string | boolean): string {
    if (typeof displayName == 'string') {
      if (this.firestoredParams.length > 0) {
        let param = this.firestoredParams.find(
          (p) => p.displayName == displayName
        );
        return param ? param['color'] : '#ffee588c';
      } else {
        return '#ffee588c';
      }
    }
  }

  // UPDATE Mensaje Parametro

  async updateParam(param: ParametroMensaje) {
    try {
      var parameters = this._mensaje.current$.getValue().parameters;
      var paramIndex = parameters.findIndex(
        (parameter) => parameter.name == param.name
      );
      parameters[paramIndex] = param;
      console.log('params defined');
      this._mensaje.current$.next({
        ...this._mensaje.current$.getValue(),
        parameters
      })
      return this.store.dispatch(actions.setUnsaved());
    } catch (error) {
      console.error(error);
      this._alerts.sendError('Error', error);
    }
  }

  // DELETE parameter

  async deleteParam(param: ParametroMensaje) {
    try {
      const parameters = this._mensaje.current$.getValue().parameters;
      var paramIndex = parameters.findIndex(
        (parameter) => parameter.name == param.name
      );
      parameters.splice(paramIndex, 1);
      console.log('params deleted');
      this._mensaje.current$.next({
        ...this._mensaje.current$.getValue(),
        parameters
      })
      this.deleteParamInParts(param.displayName);
      return this.store.dispatch(actions.setUnsaved());
    } catch (error) {
      console.error(error);
      this._alerts.sendError('Error', error);
    }
  }

  /**
   * Elimina el parámetro de todas las frases de entrenamiento que lo contengan
   */
  private async deleteParamInParts(displayName: string) {
    const trainingPhrases = this._mensaje.current$.getValue().trainingPhrases;
    // displayName = displayName.split('@')[1]
    await this._loading.asyncForEach(
      trainingPhrases,
      async (frase: FraseEntrenamiento, index) => {
        // Busca en las partes donde hay el parámetro eliminado
        return await this._loading.asyncForEach(
          frase.parts,
          (parte: FraseParte, parteIndex) => {
            if (parte.alias) {
              if (parte.alias == displayName){
                delete frase.parts[parteIndex].entityType;
                delete frase.parts[parteIndex].alias;

                let partsString = this._frases.stringifyFullPhrase(frase);
                let partsRestored = this._frases.createParts(partsString);
                frase.parts = partsRestored;

                return this._frases.updatePhrase(frase);
              }

            }
          }
        );
      }
    );

    this.parameterDeleted$.next(true);

    return;
  }
}
