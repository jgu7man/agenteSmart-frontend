import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TipoEntidadModel } from '../tipos/tipo.model';
import { Loading } from '../../../../../Gdev-Tools/loading/loading.service';
import { TiposService } from './tipos.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'aSmart-tipos',
  templateUrl: './tipos.component.html',
  styleUrls: ['./tipos.component.scss']
})
export class TiposComponent implements OnInit {

  tiposList: TipoEntidadModel[]
  tiposList$: Observable<TipoEntidadModel[]>
  constructor (
    public tipos: TiposService,
    private loading: Loading
  ) { }

  ngOnInit(): void {
    this.getTipos()
  }

  async getTipos() {
    this.tiposList = await this.tipos.get()
  }

  async onNewTipo() {
    this.tiposList = []  
    await this.loading.waitFor( 200 )
    console.log(this.tiposList);
    this.getTipos()
  }

  onDeleted(tipoName: string) {
    var tipoDeleted = this.tiposList.findIndex( tipo => tipo.name === tipoName )
    this.tiposList.splice(tipoDeleted, 1)
  }

  trackByName(index: number, tipo: TipoEntidadModel): string {
    return tipo.name;
  }
  

}
