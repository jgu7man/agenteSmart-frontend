import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContextoModel } from '../contexto.model';
import { ContextosService } from '../contextos.service';
import { Loading } from '../../../../../../gdev-tools/loading/loading.service';

@Component({
  templateUrl: './add-contexto-dialog.component.html',
  styleUrls: ['./add-contexto-dialog.component.scss']
})
export class AddContextoDialogComponent implements OnInit {

  constructor (
    public dialog_: MatDialogRef<AddContextoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public nuevoContexto: ContextoModel,
    private _contextos: ContextosService,
    private loading: Loading
  ) { }

  ngOnInit(): void {
  }


  async onSave() {
    this.loading.toggleWaitingSpinner('open')
    let contexto = await this._contextos.setContext(this.nuevoContexto)
    this.loading.toggleWaitingSpinner('close')
    this.dialog_.close(contexto)
  }

}
