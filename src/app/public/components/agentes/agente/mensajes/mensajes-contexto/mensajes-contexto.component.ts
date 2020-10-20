import { AlertService } from './../../../../../../Gdev-Tools/alerts/alert.service';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import {ContextosService } from '../../contextos/contextos.service';
import { ActivatedRoute } from '@angular/router';
import { Loading } from '../../../../../../Gdev-Tools/loading/loading.service';
import { TextService } from 'src/app/services/text.service';
import { AgenteModel } from '../../../init-agente/agente.model';
import { AgentesService } from '../../../agentes.service';
import { MensajesService } from '../mensajes.service';
import { IntentModel } from '../mensaje.model';
import { CacheService } from '../../../../../../Gdev-Tools/cache/cache.service';
import { ContextoModel } from '../../contextos/contexto.model';
import { startWith, map, tap } from 'rxjs/operators';
import { DiagramService } from '../diagram/diagram.service';
import { DiagramProps } from '../diagram/diagram-data.interface';

@Component({
  selector: 'aSmart-mensajes-by-contexto',
  templateUrl: './mensajes-contexto.component.html',
  styleUrls: ['./mensajes-contexto.component.scss']
})
export class MensajesByContextoComponent implements OnInit {

  agente: AgenteModel
  projectId
  newIntent: string = ''
  switchAddIntent: boolean = false
  mensajes: IntentModel[]

  @Input() contexto: ContextoModel
  @ViewChild( 'intentNuevo' ) intentNuevo: ElementRef
  
  constructor (
    private _loading: Loading,
    public mensajes_: MensajesService,
    private _cache: CacheService,
    private _alerta: AlertService,
    public diagram_: DiagramService 
  ) {
    
   }

  async ngOnInit() {
    this.getMensajes()
    this.mensajes_.reloadMensajes$.subscribe( get => {
      console.log( get );
      if ( get ) this.getMensajes()
    } )
  }

  

  async toAddIntent() {
    this.switchAddIntent = !this.switchAddIntent
    await this._loading.waitFor( 100 )
    this.intentNuevo.nativeElement.focus()
  }

  

  async onAddIntent(contexto) {
    this.switchAddIntent = false
   
    if ( this.newIntent ) {
      let lastIndex = this.mensajes.length
      //
      try {
        // debugger
        const newIntent = await this.mensajes_.createNewIntent(
          {
            displayName: this.newIntent,
            inputContextNames: lastIndex > 0 ? [contexto] : []
          } );

        
        console.log(newIntent);
        if (newIntent) {
          console.info('Intent Created, response:', newIntent)
          //se ha creado el intent(regresa un intent completo vacio),
          // Ejemplo de nombre: projects/prueba-aente/agent/intents/f0b12fde-9600-4e2e-88a7-70861817a358
          const name = newIntent.name; //formato larguisimo solo ocupamos su ID
          const resourceID = name.slice(name.lastIndexOf("/") + 1); //formato esperado: f0b12fde-9600-4e2e-88a7-70861817a358
          //aqui nose que hacer con el resourceID
          await this.mensajes_.setMensaje( newIntent, lastIndex, contexto )

        }
      } catch (error) {
        if (error) {
          console.error(error)
          this._alerta.sendFloatNotification("Error creando intent, porfavor vuelva a intentarlo.")
        }
      }
    }
  }

  

  async getMensajes() {
    this.mensajes = await this.mensajes_.getMensajesListByContexto( this.contexto )
    let contextosLists = await this._cache.getDataKey( 'contextosLists' )
    if ( !contextosLists ) {
      contextosLists = { [ this.contexto.contextName ]: this.mensajes }
    } else {
      contextosLists[this.contexto.contextName] = this.mensajes
    }
    this._cache.updateData( 'contextosLists', contextosLists)
  }

  trackByName( index, intent: IntentModel ) {
    return intent.name
  }


  async setDiagramaData( props: DiagramProps, id ) {
    this.diagram_.object$.next( { props, id,
      anchors: await this.mensajes_.getFollowingMensajes( id )
    })
  }
  

}
