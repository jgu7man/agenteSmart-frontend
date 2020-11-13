import { RespuestaCard, CardButton } from './../../agentes/agente/mensajes/mensaje/entrenamiento/respuestas/respuestasIntent.model';
import {Component, OnInit, ViewChild} from '@angular/core';
import {TarjetaModel, tipoContenido} from '../tarjeta.model';
import {MatDialogRef} from '@angular/material/dialog';
import {EstaticaTarjetaComponent} from '../estatica-tarjeta/estatica-tarjeta.component';
import {TarjetasService} from '../tarjetas.service';

import {CurrentAgenteService} from '../../agentes/agente/current-agente.service';

@Component({
    templateUrl: './add-tarjeta.component.html',
    styleUrls: ['./add-tarjeta.component.scss']
})
export class AddTarjetaComponent implements OnInit {

    /** Tipo de contenidos de tarjeta
     * @deprecated
     * @type {tipoContenido[]}
     */
    private tiposContenido: tipoContenido[] = [
        {value: 'estatico', viewValue: 'Estático'},
        {value: 'coleccion', viewValue: 'Colección'},
        {value: 'producto', viewValue: 'Producto'},
        {value: 'servicio', viewValue: 'Servicio'},
    ]
    /** Se encarga de importar el componente de la tarjeta estática */
    @ViewChild(EstaticaTarjetaComponent) estaticaForm: EstaticaTarjetaComponent
    /** Modelo de nuevo botón */
    public nuevoBoton: CardButton = {text: '', postback: ''}
    /** Arreglo de botones de la tarjeta */
    public botones: CardButton[] = []
    /** Modelo de tarjeta */
    public tarjeta: TarjetaModel

    constructor (
        public dialog: MatDialogRef<AddTarjetaComponent>,
        private tarjetaServ: TarjetasService,
        public agenteS: CurrentAgenteService
    ) {
        this.tarjeta = new TarjetaModel('')
    }

    ngOnInit(): void {
    }


    /**
     * Asigna el contenido de la tarjeta al modelo
     *
     * @param {RespuestaCard} contenido
     */
    updateTarjeta(contenido: RespuestaCard) {
        this.tarjeta.contenido = contenido
    }

    /**
     * Manda a guardar la tarjeta al servicio
     *
     */
    save() {
        this.tarjeta.contenido = this.estaticaForm.contenido
        if (this.botones.length > 0) {
            this.tarjeta.botones = this.botones
        }
        this.tarjetaServ.addTarjeta(this.tarjeta)
        this.dialog.close()
    }

    /**
     * Agrega un botón creado al arreglo
     *
     */
    addBoton() {
        this.botones.push(this.nuevoBoton)
        this.nuevoBoton = {text: '', postback: ''}
    }

    /**
     * Eliminar el botón del arreglo
     *
     * @param {number} botonIndex
     */
    delBoton(botonIndex: number) {
        this.botones.splice(botonIndex, 1)
    }
}
