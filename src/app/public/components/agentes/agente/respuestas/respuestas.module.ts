import { CondicionalFormComponent } from './respuesta-card/res-forms/condicional-form/condicional-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RespuestasRoutingModule } from './respuestas-routing.module';
import { RespuestasComponent } from './respuestas.component';
import { RespuestaCardComponent } from './respuesta-card/respuesta-card.component';
import { BuscarFormComponent } from './respuesta-card/res-forms/buscar-form/buscar-form.component';
import { GrupoDatosComponent } from './respuesta-card/res-forms/grupo-datos/grupo-datos.component';
import { PredefinidaFormComponent } from './respuesta-card/res-forms/predefinida-form/predefinida-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';


@NgModule({
  declarations: [
    RespuestasComponent,
    RespuestaCardComponent,
    BuscarFormComponent,
    CondicionalFormComponent,
    GrupoDatosComponent,
    PredefinidaFormComponent,
  ],
  imports: [
    CommonModule,
    RespuestasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [
    RespuestasComponent
  ]
})
export class RespuestasModule { }
