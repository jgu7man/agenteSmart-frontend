import { Component, OnInit } from '@angular/core';
import { CacheService } from 'src/app/gdev-tools/cache/cache.service';
import { Loading } from 'src/app/gdev-tools/loading/loading.service';
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
        private loading: Loading,
        private _cache: CacheService,
        private _mensajes: MensajesService,
        public dialog: MatDialogRef<AddMensajeComponent>
    ) { }

  ngOnInit(): void {
  }

    catchContextSelected(selected: ContextSelected) {
        this.context = selected.context
        const contextLists = this._cache.getDataKey('contextosLists')
        const contextListSelected: MensajeModel[] = contextLists[selected.context]
        this.lastIndex = contextListSelected.length
    }

  async onAddIntent() {
    this.loading.toggleWaitingSpinner('open')
    this.switchAddIntent = false;

    if (this.newIntent) {
        await this._mensajes.setMensaje(this.newIntent, this.lastIndex, this.context ? this.context : null)
        this.dialog.close(this.newIntent)
    }
  }

}
