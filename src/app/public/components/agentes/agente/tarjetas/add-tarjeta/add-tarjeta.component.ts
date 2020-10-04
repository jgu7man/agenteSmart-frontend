import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { RespuestaCard, RespuestaCardButton } from './../../mensajes/mensaje/entrenamiento/respuestas/respuesta.model';
import { TarjetaModel, tipoContenido } from '../tarjeta.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EstaticaTarjetaComponent } from '../estatica-tarjeta/estatica-tarjeta.component';
import { TarjetasService } from '../tarjetas.service';
import { MatSelectChange } from '@angular/material/select';
import { CurrentAgenteService } from '../../current-agente.service';

@Component({
  templateUrl: './add-tarjeta.component.html',
  styleUrls: ['./add-tarjeta.component.scss']
})
export class AddTarjetaComponent implements OnInit {

  @ViewChild( EstaticaTarjetaComponent ) estaticaForm: EstaticaTarjetaComponent

  tiposContenido: tipoContenido[] = [
    { value: 'estatico', viewValue: 'Estático' },
    { value: 'coleccion', viewValue: 'Colección' },
    { value: 'producto', viewValue: 'Producto' },
    { value: 'servicio', viewValue: 'Servicio' },
  ]

  filterColeccion = {key: 'guardado'}
  nuevoBoton: RespuestaCardButton = { text: '', link: '' }
  botones: RespuestaCardButton[] = []

  public tarjeta: TarjetaModel

  constructor (
    public dialog: MatDialogRef<AddTarjetaComponent>,
    private tarjetaServ: TarjetasService,
    public agenteS: CurrentAgenteService
  ) {
    this.tarjeta = new TarjetaModel( '' )
  }

  ngOnInit(): void {
  }

  onTipoContenidoSelected(change: MatSelectChange) {
    this.tarjeta.tipoContenido = change.value
  }

  onColecctionNameSelected( change: MatSelectChange ) {
    let coleccion = this.agenteS.coleccionesList
      .find(c => c.name == change.value)
    this.tarjeta.contenido = coleccion
  }

  updateTarjeta( contenido: RespuestaCard ) {
    this.tarjeta.contenido = contenido
  }

  save() {
    if ( this.tarjeta.tipoContenido == 'estatico' ) {
      this.tarjeta.contenido = this.estaticaForm.contenido
    }
    if ( this.botones.length > 0 ) {
      this.tarjeta.botones = this.botones
    }
    console.log( this.tarjeta );
    this.tarjetaServ.addTarjeta(this.tarjeta)
    this.dialog.close()
  }

  addBoton() {
    this.botones.push( this.nuevoBoton )
    this.nuevoBoton = { text: '', link: '' }
  }

  delBoton( botonIndex: number ) {
    this.botones.splice( botonIndex, 1 )
  }
}
