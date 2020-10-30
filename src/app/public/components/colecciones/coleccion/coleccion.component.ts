import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColeccionModel } from '../collection.interface';
import { ColeccionesService } from '../colecciones.service';
import { MatDialog } from '@angular/material/dialog';
import { DelColeccionComponent } from '../del-coleccion/del-coleccion.component';
import { AlertService } from '../../../../Gdev-Tools/alerts/alert.service';

@Component({
  selector: 'aSmart-coleccion',
  templateUrl: './coleccion.component.html',
  styleUrls: ['./coleccion.component.scss']
})
export class ColeccionComponent implements OnInit {

  @Input() coleccion: ColeccionModel
  @Output() close = new EventEmitter<any>()
  
  newTipoColeccion = ''
  

  constructor (
    public colecciones: ColeccionesService,
    private _alerta: AlertService,
    private _dialog: MatDialog
  ) {
    this.coleccion = new ColeccionModel('', '', [], [], [])
   }

  ngOnInit(): void {
  }



  

  updateColeccion() {
    
  }


  onDelete() {
    var delDialog = this._dialog
      .open( DelColeccionComponent, {
      minWidth: 450,
      data:this.coleccion.name
    } )
    
    delDialog.afterClosed().subscribe( () => {
      this.close.emit()
    })
    

  }


  

  

  
  

}
