import { GdevAlert } from './../../../../../../gdev-tools/src/lib/alert/alert.service';
import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { GdevLoading } from '../../../../../../gdev-tools/src/lib/loading/loading.service';
import { MensajesService } from '../mensajes.service';
import { IntentModel } from '../mensaje.model';
import { CurrentAgenteService } from '../../current-agente.service';
import { GdevCache } from '../../../../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { DiagramProps } from '../diagram/diagram-data.interface';
import { DiagramService } from '../diagram/diagram.service';
import { GdevText } from '../../../../../../gdev-tools/src/lib/text/gdev-text.service';
import { ContextoModel } from '../../contextos/contexto.model';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ContextosService } from '../../contextos/contextos.service';
@Component({
  selector: 'aSmart-mensajes-list',
  templateUrl: './mensajes-list.component.html',
  styleUrls: ['./mensajes-list.component.scss']
})
export class MensajesListComponent implements OnInit , OnDestroy{

  switchAddIntent: boolean = false
  newIntent: string = '';
  newDisplayName: string = ''
  mensajes: IntentModel[];
  listSubs: Subscription
  agenteSubs: Subscription


  // @Input() contexto
  @ViewChild( 'intentNuevo' ) intentNuevo: ElementRef
  constructor (
    private _loading: GdevLoading,
    public mensajes_: MensajesService,
      public agente_: CurrentAgenteService,
    private _contexts:ContextosService,
    public diagram_: DiagramService,
    private _text: GdevText,
    private _cache: GdevCache
  ) {
      this.getMensajes()
   }

  async ngOnInit() {
  }

  async getMensajes() {
    this.agente_.intentList$.pipe(
        distinctUntilChanged( ( x, y ) => x && ( x.length == y.length))
    ).subscribe(async () => {
        await this.mensajes_.getMensajesWithoutContext().then(list => {
            this.mensajes = list
            this._contexts.setContextosList('no-context', list)
        })
    });
}

  async toAddIntent() {
    this.switchAddIntent = !this.switchAddIntent
    await this._loading.waitFor( 100 )
    this.intentNuevo.nativeElement.focus()
  }

  async onAddIntent() {
    this._loading.toggleWaitingSpinner('open')
    this.switchAddIntent = false;
    if ( !this.mensajes ) this.mensajes = []

    if (this.newIntent) {
        let lastIndex = this.mensajes.length;
        await this.mensajes_.saveNewMensaje(this.newIntent, lastIndex);

    }
  }


  getMensajeRoute(name:string) {
    name = name.slice(name.lastIndexOf('/') + 1);
    return name
  }

    async setDiagramaData(props: DiagramProps, id) {
        this.diagram_.object$.next({
            props,
            id,
            anchors: await this.mensajes_.getNextMensajes(id)
        });
    }


  trackByName( index, intent: IntentModel ) {
    return intent.name
  }

  ngOnDestroy() {
    // this.agenteSubs.unsubscribe()
    if ( this.listSubs ) this.listSubs.unsubscribe()
  }

}
