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

    @ViewChild(EstaticaTarjetaComponent) estaticaForm: EstaticaTarjetaComponent
    /**
     * Tipo de contenidos de tarjeta
     * @deprecated
     * @type {tipoContenido[]}
     */
    tiposContenido: tipoContenido[] = [
        {value: 'estatico', viewValue: 'Estático'},
        {value: 'coleccion', viewValue: 'Colección'},
        {value: 'producto', viewValue: 'Producto'},
        {value: 'servicio', viewValue: 'Servicio'},
    ]

    filterColeccion = {key: 'guardado'}
    nuevoBoton: CardButton = {text: '', postback: ''}
    botones: CardButton[] = []

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


    updateTarjeta(contenido: RespuestaCard) {
        this.tarjeta.contenido = contenido
    }

    save() {
        this.tarjeta.contenido = this.estaticaForm.contenido
        if (this.botones.length > 0) {
            this.tarjeta.botones = this.botones
        }
        this.tarjetaServ.addTarjeta(this.tarjeta)
        this.dialog.close()
    }

    addBoton() {
        this.botones.push(this.nuevoBoton)
        this.nuevoBoton = {text: '', postback: ''}
    }

    delBoton(botonIndex: number) {
        this.botones.splice(botonIndex, 1)
    }
}
