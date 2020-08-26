import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';


import { CommonModule } from '@angular/common';
import { MensajesComponent } from './mensajes.component';
import { MensajesListComponent } from './mensajes-list/mensajes-list.component';
import { MensajeComponent } from './mensaje/mensaje.component';
import { EntrenamientoComponent } from './mensaje/entrenamiento/entrenamiento.component';
import { AddParameterComponent } from './mensaje/entrenamiento/parametros/add-parameter/add-parameter.component';
import { ParamRowComponent } from './mensaje/entrenamiento/parametros/param-row/param-row.component';
import { ParamValueComponent } from './mensaje/entrenamiento/parametros/param-value/param-value.component';
import { BreadcumsComponent } from './mensaje/entrenamiento/breadcums/breadcums.component';
import { FrasesFormComponent } from './mensaje/entrenamiento/frases-form/frases-form.component';
import { FraseItemComponent } from './mensaje/entrenamiento/frases-form/frase-item/frase-item.component';
import { FraseParametersComponent } from './mensaje/entrenamiento/frases-form/frase-parameters/frase-parameters.component';
import { PartParameterComponent } from './mensaje/entrenamiento/frases-form/frase-parameters/part-parameter/part-parameter.component';
import { MensajeHeaderComponent } from './mensaje/entrenamiento/mensaje-header/mensaje-header.component';
import { ParametrosComponent } from './mensaje/entrenamiento/parametros/parametros.component';
import { DelMensajeDialogComponent } from './del-mensaje-dialog/del-mensaje-dialog.component';
import { MensajesRoutingModule } from './mensajes-routing.module';
import { RespuestasModule } from '../respuestas/respuestas.module';
import { TiposModule } from '../tipos/tipos.module';
import { ColorThemeModule } from '../../../../../Gdev-Tools/gdev-color/color-theme.module';



@NgModule({
  declarations: [
    MensajesComponent,
    MensajesListComponent,
    MensajeComponent,
    EntrenamientoComponent,
    ParametrosComponent,
    AddParameterComponent,
    ParamRowComponent,
    ParamValueComponent,
    BreadcumsComponent,
    FrasesFormComponent,
    FraseItemComponent,
    FraseParametersComponent,
    PartParameterComponent,
    MensajeHeaderComponent,
    DelMensajeDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MensajesRoutingModule,
    RespuestasModule,
    TiposModule,
    ColorThemeModule
  ],
  exports: [
    MensajesComponent
  ]
})
export class MensajesModule { }
