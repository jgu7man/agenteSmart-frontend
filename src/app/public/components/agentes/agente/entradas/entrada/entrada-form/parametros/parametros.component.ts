import { Component, OnInit, OnDestroy } from '@angular/core';
import { ParametroEntrada } from '../../../entrada.model';
import { ParametrosService } from './parametros.service';
import { Observer, Subscription } from 'rxjs';

@Component({
  selector: 'aSmart-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss']
})
export class ParametrosComponent implements OnInit, OnDestroy {

  parametros: ParametroEntrada[]
  listenNewParam$: Subscription
  listenParamDeleted$: Subscription

  constructor (
    private _params: ParametrosService
  ) { }

  async ngOnInit() {
    await this.loadParams()
    this.listenNewParam$ = this._params.parameterAdded$
      .subscribe( () => { this.loadParams() } )
    this.listenParamDeleted$ = this._params.parameterDeleted$
      .subscribe( () => { this.loadParams() })
  }
  
  
  async loadParams() {
    this.parametros = await this._params.get()
  }

  toAddParam() {
    
  }

  
  ngOnDestroy() {
    this.listenNewParam$.unsubscribe()
    this.listenParamDeleted$.unsubscribe()
  }

}
