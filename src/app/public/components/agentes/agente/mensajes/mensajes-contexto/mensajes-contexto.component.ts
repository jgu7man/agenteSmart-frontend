import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { GdevLoading } from 'src/app/gdev-tools/src/lib/loading/loading.service';
import { AgenteModel } from '../../../init-agente/agente.model';
import { MensajesService } from '../mensajes.service';
import { IntentModel } from '../mensaje.model';
import { GdevCache } from 'src/app/gdev-tools/src/lib/cache/gdev-cache.service';
import { ContextoModel } from '../../contextos/contexto.model';
import { startWith, distinctUntilChanged } from 'rxjs/operators';
import { DiagramService } from '../diagram/diagram.service';
import { DiagramProps } from '../diagram/diagram-data.interface';
import { CurrentAgenteService } from '../../current-agente.service';
import { ContextosService } from '../../contextos/contextos.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'aSmart-mensajes-by-contexto',
  templateUrl: './mensajes-contexto.component.html',
  styleUrls: ['./mensajes-contexto.component.scss'],
})
export class MensajesByContextoComponent implements OnInit {
  agente: AgenteModel;
  projectId;
  newIntent: string = '';
  switchAddIntent: boolean = false;
  mensajes: IntentModel[];

  @Input() contexto: ContextoModel;
  @ViewChild('intentNuevo') intentNuevo: ElementRef;

  constructor(
    private _loading: GdevLoading,
    public mensajes_: MensajesService,
    private _cache: GdevCache,
    private _alerta: GdevAlert,
    public diagram_: DiagramService,
    private _agente: CurrentAgenteService,
    private _contexts: ContextosService
  ) {}

  async ngOnInit() {
    this.getMensajes();
  }

  async getMensajes() {
    this.mensajes_.list$
      .pipe(distinctUntilChanged((x, y) => x && x.length == y.length))
      .subscribe(async () => {
        await this.mensajes_
          .getMensajesListByContexto(this.contexto)
          .then((list) => {
            this.mensajes = list;
            this._contexts.setContextosList(this.contexto.contextName, list);
          });
      });
  }

  getMensajeRoute(name: string) {
    name = name.slice(name.lastIndexOf('/') + 1);
    return name;
  }

  trackByName(index, intent: IntentModel) {
    return intent.name;
  }

  async toAddIntent() {
    this.switchAddIntent = !this.switchAddIntent;
    await this._loading.waitFor(100);
    this.intentNuevo.nativeElement.focus();
  }

  async onAddIntent(contexto) {
    this._loading.toggleWaitingSpinner('open');
    this.switchAddIntent = false;
    if (!this.mensajes) this.mensajes = [];

    if (this.newIntent) {
      let lastIndex = this.mensajes.length;
      console.log(`creado ${this.newIntent}, index: ${lastIndex}`);
      await this.mensajes_.saveNewMensaje(this.newIntent, lastIndex, contexto);
    }
  }

  async setDiagramaData(props: DiagramProps, id) {
    this.diagram_.object$.next({
      props,
      id,
      anchors: await this.mensajes_.getNextMensajes(id),
    });
  }

  drop(event: CdkDragDrop<IntentModel[]>) {
    moveItemInArray(this.mensajes, event.previousIndex, event.currentIndex);
    console.log(this.mensajes);
    this.mensajes_.orderContextMensajes(this.mensajes)
  }
}
