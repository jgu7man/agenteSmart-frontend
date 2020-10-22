import { AddTipoComponent } from './add-tipo/add-tipo.component';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { TipoEntidadModel } from '../tipos/tipo.model';
import { Loading } from '../../../../../Gdev-Tools/loading/loading.service';
import { TiposService } from './tipos.service';
import { Observable } from 'rxjs';
import { CurrentAgenteService } from '../current-agente.service';
import { MatDialog } from '@angular/material/dialog';
import { TipoComponent } from './tipo/tipo.component';

@Component({
  selector: 'aSmart-tipos',
  templateUrl: './tipos.component.html',
  styleUrls: ['./tipos.component.scss']
})
export class TiposComponent implements OnInit {

  tiposList$: Observable<TipoEntidadModel[]>
  @ViewChildren(TipoComponent) public tiposList: QueryList<TipoComponent>


  constructor (
    public tipos_: TiposService,
    public agente: CurrentAgenteService,
    private _dialog: MatDialog,
    private loading: Loading
  ) { }

  ngOnInit(): void {
    this.tipos_.getAllEntities().subscribe( res => {
      console.log(res);
    })
  }


  openAdd() {
    var dialog = this._dialog.open( AddTipoComponent, {
      minWidth: 300
    } )
    
    dialog.beforeClosed().subscribe(async tipoName => {
      console.log(tipoName);
      if ( tipoName ) {
        await this.loading.waitFor(100)
        var tipoCreated = this.tiposList.find(t => t.tipo.name == tipoName)
        // this.tiposList.forEach( t => { 
        //   if ( t.tipo.name == tipoName ) { tipoCreated = t}
        // } )
        await this.loading.waitFor(100)
        tipoCreated.tipoPanel.open()
      }
    })
  }
  
  

}
