import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { TarjetaModel, tipoContenido } from '../tarjeta.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EstaticaTarjetaComponent } from '../estatica-tarjeta/estatica-tarjeta.component';
import { MatSelectChange } from '@angular/material/select';
import { TarjetasService } from '../tarjetas.service';
import {
    RespuestaCardButton,
    RespuestaCard,
} from '../../agentes/agente/mensajes/mensaje/entrenamiento/respuestas/respuesta.model';
import { CurrentAgenteService } from '../../agentes/agente/current-agente.service';

@Component({
    templateUrl: './tarjeta-edit.component.html',
    styleUrls: ['./tarjeta-edit.component.scss'],
})
export class TarjetaEditComponent implements OnInit {
    @ViewChild(EstaticaTarjetaComponent) estaticaForm: EstaticaTarjetaComponent;

    tiposContenido: tipoContenido[] = [
        { value: 'estatico', viewValue: 'Estático' },
        { value: 'coleccion', viewValue: 'Colección' },
        { value: 'producto', viewValue: 'Producto' },
        { value: 'servicio', viewValue: 'Servicio' },
    ];

    nuevoBoton: RespuestaCardButton = { text: '', link: '' };
    botones: RespuestaCardButton[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public tarjeta: TarjetaModel,
        public dialog: MatDialogRef<TarjetaEditComponent>,
        public agenteS: CurrentAgenteService,
        private tarjetaS: TarjetasService
    ) {
        this.botones = tarjeta.botones;
    }

    ngOnInit(): void {
        console.log(this.tarjeta);
    }

    updateTarjeta(contenido: RespuestaCard) {
        this.tarjeta.contenido = contenido;
    }

    onColecctionNameSelected(change: MatSelectChange) {
        // let coleccion = this.agenteS.coleccionesList
        //   .find( c => c.name == change.value )
        // this.tarjeta.contenido = coleccion
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
        this.botones.push(this.nuevoBoton);
        this.nuevoBoton = { text: '', link: '' };
    }

    delBoton(botonIndex: number) {
        this.botones.splice(botonIndex, 1);
    }
}
