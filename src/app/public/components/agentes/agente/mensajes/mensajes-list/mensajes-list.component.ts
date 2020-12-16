import { AlertService } from './../../../../../../Gdev-Tools/alerts/alert.service';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Loading } from '../../../../../../Gdev-Tools/loading/loading.service';
import { MensajesService } from '../mensajes.service';
import { IntentModel } from '../mensaje.model';
import { CurrentAgenteService } from '../../current-agente.service';
import { CacheService } from '../../../../../../Gdev-Tools/cache/cache.service';
import { DiagramProps } from '../diagram/diagram-data.interface';
import { DiagramService } from '../diagram/diagram.service';
import { TextService } from '../../../../../../Gdev-Tools/text/gdev-text.service';
import { ContextoModel } from '../../contextos/contexto.model';
@Component({
  selector: 'aSmart-mensajes-list',
  templateUrl: './mensajes-list.component.html',
  styleUrls: ['./mensajes-list.component.scss']
})
export class MensajesListComponent implements OnInit {

  switchAddIntent: boolean = false
  newIntent: string = '';
  newDisplayName: string = ''
  mensajes: IntentModel[];


  // @Input() contexto
  @ViewChild( 'intentNuevo' ) intentNuevo: ElementRef
  constructor (
    private _loading: Loading,
    public mensajes_: MensajesService,
    public agente: CurrentAgenteService,
    public diagram_: DiagramService,
    private _text: TextService,
    private _cache: CacheService
  ) { }

  async ngOnInit() {
    this.getMensajes()
  }

  async getMensajes() {
        
    this.mensajes = await this.mensajes_.getMensajesWithoputContext();
    let contextosLists = this._cache.getDataKey('contextosLists');
    let agentContextos: ContextoModel[] = this._cache.getDataKey('contextos')

    
    
    if (!contextosLists) {
        contextosLists = { ['sinContexto']: this.mensajes };
    }
    else {
        contextosLists['sinContexto'] = this.mensajes;
    }
    if (agentContextos) {
        
        Object.keys(contextosLists).forEach((name) => {
            let contexto = agentContextos.find(c => c.contextName == name)
            if (!contexto) delete contextosLists[name]
        })

    }
    this._cache.updateData('contextosLists', contextosLists);
    
}

  async toAddIntent() {
    this.switchAddIntent = !this.switchAddIntent
    await this._loading.waitFor( 100 )
    this.intentNuevo.nativeElement.focus()
  }

  async onAddIntent() {
    this._loading.toggleWaitingSpinner(true)
    this.switchAddIntent = false;
    if ( !this.mensajes ) this.mensajes = []
    
    let contexto = this._text.normalize(this.newIntent).toLowerCase()

    if (this.newIntent) {
        let lastIndex = this.mensajes.length;
        await this.mensajes_.setMensaje(this.newIntent, lastIndex, contexto);
        
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
        anchors: await this.mensajes_.getFollowingMensajes(id),
    });
}
  

  trackByName( index, intent: IntentModel ) {
    return intent.name
  }

}
