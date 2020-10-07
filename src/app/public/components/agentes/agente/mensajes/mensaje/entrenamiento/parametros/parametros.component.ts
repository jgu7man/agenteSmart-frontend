import { Component, OnInit, OnDestroy } from '@angular/core';
import { ParametroMensaje } from '../../../mensaje.model';
import { ParametrosService } from './parametros.service';
import { Observer, Subscription } from 'rxjs';
import { CurrentMensajeService } from '../../current-mensaje.service';

@Component({
  selector: 'aSmart-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss']
})
export class ParametrosComponent implements OnInit, OnDestroy {

  listenNewParam$: Subscription
  listenParamDeleted$: Subscription
  switchAddParameter: boolean = false

  constructor (
    public mensaje: CurrentMensajeService,
    public params: ParametrosService
  ) { }

  async ngOnInit() {
    // await this.loadParams()
    // this.listenNewParam$ = this.params.parameterAdded$
    //   .subscribe( () => { this.loadParams() } )
    // this.listenParamDeleted$ = this.params.parameterDeleted$
    //   .subscribe( () => { this.loadParams() })
  }
  
  
  async loadParams() {
    
  }

  toAddParam() {
    this.switchAddParameter = true
  }

  
  ngOnDestroy() {
    // this.listenNewParam$.unsubscribe()
    // this.listenParamDeleted$.unsubscribe()
  }

}
