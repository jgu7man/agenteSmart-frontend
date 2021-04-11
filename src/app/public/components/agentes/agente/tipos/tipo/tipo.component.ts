import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { TipoEntidadModel } from '../tipo.model';
import { TiposService } from '../tipos.service';
import { CurrentTipoService } from './current-tipo.service';
import { TipoState } from '../store/tipo.state';

@Component({
  selector: 'aSmart-tipo',
  templateUrl: './tipo.component.html',
  styleUrls: ['./tipo.component.scss'],
})
export class TipoComponent implements OnInit, OnDestroy {

  /** Static info of current tipo */
  // tipo: TipoState;
  /** Emits on close panel request or after save */
  @Output() closePanel = new EventEmitter<any>();

  constructor(
    public tipos_: TiposService,
    public tipo_: CurrentTipoService,
  ) {
  }

  @Input() set selected(tipo: TipoState) {
    // this.tipo.body = tipo
    this.tipo_.setCurrentTipo(tipo)
      .subscribe(changes => {
        console.log( changes )
        // this.tipo.saved = false
      })
  }


  async ngOnInit() {}


  async onSave() {
    await this.tipo_.onSave()
  }

  onClose() {
    this.tipo_.resetCurrent();
    this.closePanel.emit();
  }

  async delete(tipoName) {
    // let url = `/dahsboard/agente/${this.projectId}/`;
    await this.tipos_.deleteTipo(tipoName);
    // this._router
    //   .navigateByUrl(url, { skipLocationChange: true })
    //   .then(() => this._router.navigate([url + 'tipos']));
  }

  /** Prevents spaces */
  delSpaces(e) {
    if (e.which === 32) {
      e.stopPropagation();
      return false;
    } else if (e.which === 13) {
      e.stopPropagation();
    }
  }

  ngOnDestroy() {

  }
  // onDeleteTipo() {
  //   this.tiposService.deleteTipo( this.tipo.name )
  //     .then(()=> {this.tipoDeleted.emit(this.tipo.name)})
  // }
}
