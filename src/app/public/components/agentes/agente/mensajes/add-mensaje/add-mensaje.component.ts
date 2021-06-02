import { Component, OnInit } from '@angular/core';
import { GdevCache } from 'src/app/gdev-tools/src/lib/cache/gdev-cache.service';
import { GdevLoading } from 'src/app/gdev-tools/src/lib/loading/loading.service';
import { ContextSelected } from '../../contextos/contexto-selector/contexto-selector.component';
import { MensajeModel } from '../mensaje.model';
import { MensajesService } from '../mensajes.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './add-mensaje.component.html',
  styleUrls: ['./add-mensaje.component.scss']
})
export class AddMensajeComponent implements OnInit {

    switchAddIntent: boolean = false
    lastIndex: number = 0
    newIntent: string = ''
    context: string = ''

    constructor(
        private _loading: GdevLoading,
        private _cache: GdevCache,
        private _mensajes: MensajesService,
        public dialog: MatDialogRef<AddMensajeComponent>
    ) { }

  ngOnInit(): void {
  }

    catchContextSelected(selected: ContextSelected) {
        this.context = selected.context
        const contextLists = this._cache.getDataKey('contextosLists')
        const contextListSelected: MensajeModel[] = contextLists[selected.context]
      this.lastIndex = contextListSelected.length ? contextListSelected.length : 0
      console.log( this.lastIndex  )
    }

  async onAddIntent() {
    this._loading.toggleWaitingSpinner('open')
    this.switchAddIntent = false;

    if (this.newIntent) {
      await this._mensajes.saveNewMensaje(
        this.newIntent,
        this.lastIndex,
        this.context ? this.context : null
      )
        this.dialog.close(this.newIntent)
    }
  }

}
