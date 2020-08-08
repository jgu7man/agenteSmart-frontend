import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import {ContextosService } from '../contextos/contextos.service';
import { ActivatedRoute } from '@angular/router';
import { Loading } from '../../../../../global/loading/loading.service';
import { TextService } from 'src/app/services/text.service';
import { AgenteModel } from '../../init-agente/agente.model';
import { AgentesService } from '../../agentes.service';
import { EntradasService } from './entradas.service';
import { EntradaModel } from './entrada.model';

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
  entradas: EntradaModel[]

  @Input() contexto: string
  @ViewChild( 'intentNuevo' ) intentNuevo: ElementRef
  
  constructor (
    private _agentes: AgentesService,
    private _loading: Loading,
    private _entradas: EntradasService
  ) {
    
   }

  async ngOnInit() {
    this.getEntradas()
    console.log(this.entradas);
  }

  

  async onAddIntent() {
    this.switchAddIntent = !this.switchAddIntent
    await this._loading.waitFor( 100 )
    this.intentNuevo.nativeElement.focus()
  }

  

  async onSetIntent(contexto) {
    if ( this.newIntent ) {
      console.log(this.newIntent, contexto);
      await this._entradas.setEntrada( this.newIntent, contexto )
      this.switchAddIntent = false
      this.getEntradas()
    }
  }

  trackByName(index, intent: EntradaModel) {
    return intent.name
  }

  async getEntradas() {
    this.entradas = await this._entradas.getEntradasListByContextoId(this.contexto)
  }

  

}
