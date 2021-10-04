import { debounceTime, filter, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserInterface } from '../../../admin/auth/auth.service';
import { AgenteModel } from './init-agente/agente.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { GdevCache } from '../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { GdevLoading } from '../../../gdev-tools/src/lib/loading/loading.service';
import { GdevAlert } from '../../../gdev-tools/src/lib/alert/alert.service';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment  } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class AgentesService {

  /**
   * Almacena los datos del usuario autenticado
   * @private
   * @type {UserInterface} */
  private usuario: UserInterface;

  /**
   * Observable de los agentes en FIRESTORE*/
  public agentes$ = new Observable<AgenteModel[]>();
  private restURL = environment.restURL

  constructor(
    private fs: AngularFirestore,
    private router: Router,
    private _cache: GdevCache,
    private _loading: GdevLoading,
    private _alerts: GdevAlert,
    private _http: HttpClient
  ) {
    this.agentes$ = this._cache
      .listenForChanges<AgenteModel[]>('agentes')
      .pipe()
  }

  /** Establece la suscripción a los agentes */
  listenAgentes(userId: string) {
    return this.fs.collection('usuarios')
      .doc(userId)
      .collection<AgenteModel>('agentes')
      .valueChanges()
      .pipe(
        debounceTime(1000),
        tap(agentes => this._cache.updateData('agentes', agentes))
      )
  }


  /** Obtiene un agente llamado por id
   * @param {string} projectId
   * @return {AgenteModel} Agente o null
   */
  async loadOneAgente(projectId:string) {
    this.usuario = this._cache.getDataKey('user');
    const agentesList = await this._cache.getAsyncKey<AgenteModel[]>('agentes')

    try {
      const agenteDoc = agentesList.find(a => a.projectId == projectId)
      if (agenteDoc) {
        return agenteDoc
      } else {
        this._alerts.sendMessageAlert('No se encontró el agente')
        return null
      }

    } catch (error) {
      console.error(error)
      this._alerts.sendError('Error en la base de datos', error)
    }
  }





  /** Edita el agente en FIRESTORE
   * @param {AgenteModel} agent
   */
  async editAgent(agent: AgenteModel) {
    this.usuario = this._cache.getDataKey('user');

    Object.keys(agent).forEach((key) => {
      if (agent[key] == undefined) delete agent[key];
    });

    const agenetRef = this.fs.doc(
      `usuarios/${this.usuario.uid}/agentes/${agent.projectId}`
    ).ref

    try {
      await agenetRef.set({ ...agent }, { merge: true });
      this._alerts.sendFloatNotification('Agente editado');
    } catch (error) {
      console.error(error);
      this._alerts.sendError('No se pudo editar el agente', error);
    }

    this.router.navigate(['/dashboard/agentes']);
  }



  deleteAgent( projectId ): Observable<any> {
    const clientId = this._cache.getDataKey('user')['uid']

    console.log('Eliminando project')
    return this._http.delete(
      `${this.restURL}agentes/delete?projectId=${projectId}&clientId=${clientId}`
    ).pipe(
      catchError( this.handleError )
    )
  }

  private handleError( error ) {
    console.error( error )
    this._alerts.sendError( 'No se pudo borrar el agente', error )
    return throwError(
        'No se pudo borrar' );
  }

  // Arreglo de lenguaje
  lenguajes = [
    { name: 'Alemán', code: 'de' },
    { name: 'Coreano', code: 'ko' },
    { name: 'Español latino', code: 'es-419' },
    { name: 'Español españa', code: 'es-ES' },
    { name: 'Francés', code: 'fr' },
    { name: 'Francés canadiense', code: 'fr-CA' },
    { name: 'Francés de francia', code: 'fr-FR' },
    { name: 'Inglés', code: 'en' },
    { name: 'Inglés EUA', code: 'en-US' },
    { name: 'Inglés Británico', code: 'en-GB' },
    { name: 'Italiano', code: 'it' },
    { name: 'Japonés', code: 'ja' },
    { name: 'Noruego', code: 'no' },
    { name: 'Portugués', code: 'pt-BR' },
    { name: 'Ruso', code: 'ru' },
];

  // Arreglo de zonas horarias

  zonasHorarias = [
    { display: '(GMT-12:00) Etc/GMT+12', value: 'Etc/GMT+12' },
    { display: '(GMT-11:00) Pacific/Midway', value: 'Pacific/Midway' },
    { display: '(GMT-10:00) Pacific/Honolulu', value: 'Pacific/Honolulu' },
    { display: '(GMT-9:00) America/Anchorage', value: 'America/Anchorage' },
    { display: '(GMT-9:00) US/Alaska', value: 'US/Alaska' },
    {
        display: '(GMT-8:00) America/Los_Angeles',
        value: 'America/Los_Angeles',
    },
    { display: '(GMT-7:00) Monterrey/Denver', value: 'America/Denver' },
    {
        display: '(GMT-6:00) Guatemala/CDMX/Chicago',
        value: 'America/Chicago',
    },
    {
        display: '(GMT-5:00) Lima/Bogotá/New_York/',
        value: 'America/New_York',
    },
    {
        display: '(GMT-4:00) Santiago/La Paz/Barbados',
        value: 'America/Barbados',
    },
    {
        display: '(GMT-3:00) Buenos_Aires/São Paulo',
        value: 'America/Buenos_Aires',
    },
    {
        display: '(GMT-2:00) Atlantic/South_Georgia',
        value: 'Atlantic/South_Georgia',
    },
    {
        display: '(GMT-1:00) Atlantic/Cape_Verde',
        value: 'Atlantic/Cape_Verde',
    },
    { display: '(GMT0:00) Africa/Casablanca', value: 'Africa/Casablanca' },
    { display: '(GMT+1:00) Europe/Madrid', value: 'Europe/Madrid' },
    {
        display: '(GMT+2:00) Europe/Kaliningrad',
        value: 'Europe/Kaliningrad',
    },
    { display: '(GMT+3:00) Europe/Moscow', value: 'Europe/Moscow' },
    { display: '(GMT+4:00) Asia/Dubai', value: 'Asia/Dubai' },
    { display: '(GMT+4:30) Asia/Kabul', value: 'Asia/Kabul' },
    {
        display: '(GMT+5:00) Asia/Yekaterinburg',
        value: 'Asia/Yekaterinburg',
    },
    { display: '(GMT+5:30) Asia/Colombo', value: 'Asia/Colombo' },
    { display: '(GMT+5:45) Asia/Kathmandu', value: 'Asia/Kathmandu' },
    { display: '(GMT+6:00) Asia/Almaty', value: 'Asia/Almaty' },
    { display: '(GMT+6:30) Asia/Rangoon', value: 'Asia/Rangoon' },
    { display: '(GMT+7:00) Asia/Bangkok', value: 'Asia/Bangkok' },
    { display: '(GMT+8:00) Asia/Hong_Kong', value: 'Asia/Hong_Kong' },
    { display: '(GMT+9:00) Asia/Tokyo', value: 'Asia/Tokyo' },
    { display: '(GMT+9:30) Australia/Darwin', value: 'Australia/Darwin' },
    { display: '(GMT+10:00) Australia/Sydney', value: 'Australia/Sydney' },
    { display: '(GMT+11:00) Pacific/Noumea', value: 'Pacific/Noumea' },
    { display: '(GMT+12:00) Pacific/Fiji', value: 'Pacific/Fiji' },
    {
        display: '(GMT+13:00) Pacific/Tongatapu',
        value: 'Pacific/Tongatapu',
    },
  ];
}
