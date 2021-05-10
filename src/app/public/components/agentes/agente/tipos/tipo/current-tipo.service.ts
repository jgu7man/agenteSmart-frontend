import { HttpClient } from '@angular/common/http';
import { TipoEntidadModel, iEntity, iEntityType } from './../tipo.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GdevAlert, GdevCache, GdevLoading } from 'src/app/gdev-tools/src/public-api';
import { distinctUntilChanged, startWith } from 'rxjs/operators';
import { TipoState } from '../store/tipo.state';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrentTipoService {

  /** Estado en tiempo real del Tipo de dato seleccionado */
  current$: BehaviorSubject<TipoState>
  /** Obtine y almacena la ruta a la API */
  private _url = environment.restURL + 'entity';
  /** Tipo de dato que será activado */
  activatedToEdit: string
  /** Activa el campo de agregado de clase */
  switchAddClase: boolean

  constructor(
    private _cache: GdevCache,
    private _loading: GdevLoading,
    private _afs: AngularFirestore,
    private _alerts: GdevAlert,
    private _http: HttpClient
  ) {
    this.resetCurrent()
  }

  /** Obtiene la ruta a la colección de firestore */
  get tiposPath() {
    let agentePath = this._cache.getDataKey('agentePath');
    return `${agentePath}/tipos`;
  }

  /** Define el tipo de dato seleccionado */
  setCurrentTipo(tipo: TipoState) {
    tipo.saved = true
    this.current$.next(tipo)
    return this.current$.pipe(
      startWith(tipo),
      distinctUntilChanged((x,y) => JSON.stringify(x) === JSON.stringify(y))
    )
  }

  /** Establece el estado del botón de guardado como guardado */
  async onSave() {
    const tipo = this.current$.getValue()
    return this.updateTipo(tipo.body)
      .then(() => { tipo.saved = true });
  }

  // # UPDATE TIPO
  /** Prepara la entity para ser actualizada en el backend y posterior lo guarda en Firestore */
  public async updateTipo(tipo: iEntityType) {
    // GdevLoading animation
    this._loading.toggleWaitingSpinner('open');

    console.log(tipo);
    // clean object
    Object.keys(tipo).forEach((key) => {
      if (tipo[key] == undefined) delete tipo[key];
    });

    await this._putEntityRequest(tipo);
    const resourceID = tipo.name.slice(tipo.name.lastIndexOf('/') + 1);
    console.log(resourceID);

    this._afs
      .collection(this.tiposPath)
      .doc(resourceID)
      .set(tipo, { merge: true });

    this._loading.toggleWaitingSpinner('close');

    return tipo.name;
  }

  /** Actualiza la Entity en el backend */
  private _putEntityRequest(entityType: iEntityType) {
    return new Promise((resolve, reject) => {
      this._http
        .put(this._url, { entityType: entityType })
        .toPromise()
        .then((result) => {
          console.info('Entity updated', result);
          this._alerts.sendFloatNotification('Tipo guardado');
          resolve(true);
        })
        .catch((err) => {
          if (err) {
            console.error(err);
            this._loading.toggleWaitingSpinner('close');
            this._alerts.sendError(
              'No fué posible crear ese Tipo en este momento.',
              err
            );
          }
          reject(err);
        });
    });
  }

  /** Edita el DisplayName del tipo de dato en la memoria */
  editDisplayName(displayName: string) {
    this.current$.next({
      ...this.current$.getValue(),
      saved: false,
      body: {
        ...this.current$.getValue().body,
        displayName
      }
    })
  }


  /** Obtiene la clase que solicita */
  getClase(name?: string): iEntity {
    const tipo = this.current$.getValue()
    if ( name || tipo.body.entities) {
      return tipo.body.entities.find(e => e.value == name)
    } else {
      return <iEntity>{value: '', synonyms: []}
    }
  }


  /** Agrega una clase a la entity seleccionada por nombre */
  async setClase(clase: iEntity) {
    var current = this.current$.getValue()
    if (current.body.entities && current.body.entities.length > 0) {
      var clasesList = current.body.entities;
      var claseIndex = clasesList.findIndex((cla) => cla.value === clase.value);
      console.log({ claseIndex });

      if (claseIndex >= 0) {
        clasesList = [
          ...clasesList.slice(0, claseIndex),
          clase,
          ...clasesList.slice(claseIndex + 1),
        ];
      } else {
        clasesList = [...clasesList, clase];
      }

      current = {
        ...current,
        saved: false,
        body: {
          ...current.body,
          entities: clasesList
        }
      };
      this.current$.next(current);
    } else {
      current.body.entities = [clase]
      current.saved = false
      this.current$.next(current);
    }

    return;
  }

  /** Agrega sinónimos a la entity actual */
  async setSinonimo(
  clase: iEntity,
  sinonimo: string,
  action: 'add' | 'del'
  ) {

    // Obtener los datos actuales
    var current = this.current$.getValue()
    var clasesList: iEntity[] = current.body.entities;
    var claseIndex = clasesList.findIndex((c) => c.value === clase.value);

    // Si no existe la clase, se agrega a la lista actual
    if (claseIndex < 0) {
      clase['synonyms'] = [];
      clasesList = [...clasesList, clase];
    }

    // Agrega o elimina el sinónimo
    if (action == 'add') {
      clasesList = clasesList.map((c) =>
        c.value === clase.value
          ? {
              ...c,
              synonyms: c.synonyms ? [...c.synonyms, sinonimo] : [sinonimo],
            }
          : c
      );
    } else {
      clasesList.map((c) =>
        c.value === clase.value
          ? { ...c, synonyms: [...c.synonyms.filter((s) => s != sinonimo)] }
          : c
      );
    }

    // Actualiza el Tipo de dato seleccionado y lo regresa al estado
    current = {
      ...current,
      saved: false,
      body: {
        ...current.body,
        entities: clasesList
      }
    };
    this.current$.next(current);
    return;
  }


  async deleteClase( claseValue: string) {
    var current = this.current$.getValue()
    var clasesList = current.body.entities;
    var claseIndex = clasesList.findIndex(
      (clase) => clase.value === claseValue
    );

    if (claseIndex >= 0) {
      clasesList = clasesList.filter((c) => c.value != claseValue);
    }

    current = {
      ...current,
      saved: false,
      body: {
        ...current.body,
        entities: clasesList
      }
    };
    this.current$.next(current);

    return;
  }



  resetCurrent() {
    this.current$ = new BehaviorSubject({} as TipoState)
  }
}
