import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { TarjetaModel, tipoContenido } from '../tarjeta.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EstaticaTarjetaComponent } from '../estatica-tarjeta/estatica-tarjeta.component';
import { MatSelectChange } from '@angular/material/select';
import { TarjetasService } from '../tarjetas.service';
import { CurrentAgenteService } from '../../agentes/agente/current-agente.service';
import {
    RespuestaCardButton,
    RespuestaCard,
} from '../../agentes/agente/mensajes/mensaje/entrenamiento/respuestas/respuesta.model';

@Component({
    templateUrl: './tarjeta-edit.component.html',
    styleUrls: ['./tarjeta-edit.component.scss'],
})
export class TarjetaEditComponent implements OnInit {

    /** Lista en el front de tarjetas */
    @ViewChild(EstaticaTarjetaComponent) estaticaForm: EstaticaTarjetaComponent;
    
    /**
     * Tipo de contenidos de tarjeta
     * @deprecated
     * @type {tipoContenido[]}
     */
    public tiposContenido: tipoContenido[] = [
        { value: 'estatico', viewValue: 'Estático' },
        { value: 'coleccion', viewValue: 'Colección' },
        { value: 'producto', viewValue: 'Producto' },
        { value: 'servicio', viewValue: 'Servicio' },
    ];

    /** Modelo de botón para tarjeta */
    public btnNuevo: RespuestaCardButton = {text: '', link: ''};
    /** Array de botones */
    public botones: RespuestaCardButton[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public tarjeta: TarjetaModel,
        public dialog: MatDialogRef<TarjetaEditComponent>,
        public agenteS: CurrentAgenteService,
        private tarjetaS: TarjetasService
    ) {
        this.botones = tarjeta.botones;
    }

    ngOnInit(): void {
    }

    updateTarjeta(contenido: RespuestaCard) {
        this.tarjeta.contenido = contenido;
    }

    save() {
        this.tarjeta.contenido = this.estaticaForm.contenido;
        if (this.botones.length > 0) {
            this.tarjeta.botones = this.botones;
        }

        this.tarjetaS.saveTarjeta(this.tarjeta);
        this.dialog.close();
    }

    addBoton() {
        this.botones.push(this.btnNuevo);
        this.btnNuevo = { text: '', link: '' };
    }

    delBoton(botonIndex: number) {
        this.botones.splice(botonIndex, 1);
    }
}
