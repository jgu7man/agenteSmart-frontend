import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Loading } from '../../../../../../Gdev-Tools/loading/loading.service';
import { MensajesService } from '../mensajes.service';
import { IntentModel } from '../mensaje.model';

@Component({
  selector: 'aSmart-mensajes-list',
  templateUrl: './mensajes-list.component.html',
  styleUrls: ['./mensajes-list.component.scss']
})
export class MensajesListComponent implements OnInit {

  switchAddIntent: boolean = false
  newIntent: string = ''
  
  @Input() contexto
  @ViewChild( 'intentNuevo' ) intentNuevo: ElementRef

  constructor (
    private _loading: Loading,
    public mensajes: MensajesService,
  ) { }

  ngOnInit(): void {
  }

  async toAddIntent() {
    this.switchAddIntent = !this.switchAddIntent
    await this._loading.waitFor( 100 )
    this.intentNuevo.nativeElement.focus()
  }

  async onAddIntent( contexto ) {
    this.switchAddIntent = false
    if ( this.newIntent ) {
      let lastIndex = this.mensajes.list.length
      await this.mensajes.setMensaje( this.newIntent, contexto, lastIndex )
    }
  }

  trackByName( index, intent: IntentModel ) {
    return intent.name
  }

}
