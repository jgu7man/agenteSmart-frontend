import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import {ContextosService } from '../contextos/contextos.service';
import { ActivatedRoute } from '@angular/router';
import { Loading } from '../../../../../global/loading/loading.service';
import { TextService } from 'src/app/services/text.service';
import { AgenteModel } from '../../init-agente/agente.model';
import { AgentesService } from '../../agentes.service';
import { EntradasService } from './entradas.service';

@Component({
  selector: 'aSmart-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.scss']
})
export class EntradasComponent implements OnInit {

  agente: AgenteModel
  projectId
  newIntent: string = ''
  switchAddIntent: boolean = false

  @Input() contexto: string
  @ViewChild( 'intentNuevo' ) intentNuevo: ElementRef
  
  constructor (
    private _agentes: AgentesService,
    private _loading: Loading,
    private _entradas: EntradasService
  ) {
    
   }

  async ngOnInit() {
    this._agentes.agente$.subscribe( agente => {
      this.agente = agente
    })
  }

  

  async onAddIntent() {
    this.switchAddIntent = !this.switchAddIntent
    await this._loading.waitFor( 100 )
    this.intentNuevo.nativeElement.focus()
  }

  

  onSetIntent(contexto) {
    if ( this.newIntent ) {
      this._entradas.setEntrada( this.newIntent, contexto )
    }
  }

  

}
