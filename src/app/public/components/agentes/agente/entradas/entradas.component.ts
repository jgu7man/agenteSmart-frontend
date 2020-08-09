import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import {ContextosService } from '../contextos/contextos.service';
import { ActivatedRoute } from '@angular/router';
import { Loading } from '../../../../../global/loading/loading.service';
import { TextService } from 'src/app/services/text.service';
import { AgenteModel } from '../../init-agente/agente.model';
import { AgentesService } from '../../agentes.service';
import { EntradasService } from './entradas.service';
import { EntradaModel } from './entrada.model';
import { CacheService } from '../../../../../global/cache/cache.service';
import { Contexto } from '../contextos/contexto.model';

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

  @Input() contexto: Contexto
  @ViewChild( 'intentNuevo' ) intentNuevo: ElementRef
  
  constructor (
    private _loading: Loading,
    private _entradas: EntradasService,
  ) {
    
   }

  async ngOnInit() {
    this.getEntradas()
  }

  

  async toAddIntent() {
    this.switchAddIntent = !this.switchAddIntent
    await this._loading.waitFor( 100 )
    this.intentNuevo.nativeElement.focus()
  }

  

  async onAddIntent(contexto) {
    if ( this.newIntent ) {
      console.log( this.newIntent, contexto );
      let lastIndex = this.entradas.length
      await this._entradas.setEntrada( this.newIntent, contexto, lastIndex)
      this.switchAddIntent = false
      this.getEntradas()
    }
  }

  trackByName(index, intent: EntradaModel) {
    return intent.name
  }

  async getEntradas() {
    this.entradas = await this._entradas.getEntradasListByContexto( this.contexto)
  }

  

}
