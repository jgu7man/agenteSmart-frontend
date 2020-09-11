import { CondicionalFormComponent } from './agente/mensajes/mensaje/entrenamiento/respuestas/respuesta-card/res-forms/condicional-form/condicional-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { AgentesRoutingModule } from './agentes-routing.module';
import { ColorThemeModule } from '../../../Gdev-Tools/color/color-theme.module';
import { GdevResponsiveModule } from '../../../Gdev-Tools/responsive/gdev-responsive.module';
import { GdevTextModule } from '../../../Gdev-Tools/text/gdev-text.module';

import { AgentesComponent } from './agentes.component';
import { AgenteComponent } from './agente/agente.component';
import { InitAgenteComponent } from './init-agente/init-agente.component';
import { FormAgregarAgenteComponent } from './init-agente/form-agregar-agente/form-agregar-agente.component';
import { FormCrearAgenteComponent } from './init-agente/form-crear-agente/form-crear-agente.component';

import { AccionesComponent } from './agente/acciones/acciones.component';

import { ContextosComponent } from './agente/contextos/contextos.component';
import { AddContextoComponent } from './agente/contextos/add-contexto/add-contexto.component';
import { ContextoComponent } from './agente/contextos/contexto/contexto.component';
import { MensajesByContextoComponent } from './agente/mensajes/mensajes-contexto/mensajes-contexto.component';
import { MensajesListComponent } from './agente/mensajes/mensajes-list/mensajes-list.component';
import { MensajeComponent } from './agente/mensajes/mensaje/mensaje.component';
import { EntrenamientoComponent } from './agente/mensajes/mensaje/entrenamiento/entrenamiento.component';
import { ParametrosComponent } from './agente/mensajes/mensaje/entrenamiento/parametros/parametros.component';
import { AddParameterComponent } from './agente/mensajes/mensaje/entrenamiento/parametros/add-parameter/add-parameter.component';
import { ParamRowComponent } from './agente/mensajes/mensaje/entrenamiento/parametros/param-row/param-row.component';
import { ParamValueComponent } from './agente/mensajes/mensaje/entrenamiento/parametros/param-value/param-value.component';
import { BreadcumsComponent } from './agente/mensajes/mensaje/entrenamiento/breadcums/breadcums.component';
import { FrasesFormComponent } from './agente/mensajes/mensaje/entrenamiento/frases-form/frases-form.component';
import { FraseItemComponent } from './agente/mensajes/mensaje/entrenamiento/frases-form/frase-item/frase-item.component';
import { FraseParametersComponent } from './agente/mensajes/mensaje/entrenamiento/frases-form/frase-parameters/frase-parameters.component';
import { PartParameterComponent } from './agente/mensajes/mensaje/entrenamiento/frases-form/frase-parameters/part-parameter/part-parameter.component';
import { MensajeHeaderComponent } from './agente/mensajes/mensaje/entrenamiento/mensaje-header/mensaje-header.component';
import { DelMensajeDialogComponent } from './agente/mensajes/del-mensaje-dialog/del-mensaje-dialog.component';

import { OpcionesComponent } from './agente/opciones/opciones.component';

import { RespuestasComponent } from './agente/mensajes/mensaje/entrenamiento/respuestas/respuestas.component';
import { RespuestaCardComponent } from './agente/mensajes/mensaje/entrenamiento/respuestas/respuesta-card/respuesta-card.component';
import { BuscarFormComponent } from './agente/mensajes/mensaje/entrenamiento/respuestas/respuesta-card/res-forms/buscar-form/buscar-form.component';
import { GrupoDatosComponent } from './agente/mensajes/mensaje/entrenamiento/respuestas/respuesta-card/res-forms/grupo-datos/grupo-datos.component';
import { PredefinidaFormComponent } from './agente/mensajes/mensaje/entrenamiento/respuestas/respuesta-card/res-forms/predefinida-form/predefinida-form.component';

import { TiposComponent } from './agente/tipos/tipos.component';
import { AddTipoComponent } from './agente/tipos/add-tipo/add-tipo.component';
import { AddClaseComponent } from './agente/tipos/add-tipo/add-clase/add-clase.component';
import { TipoComponent } from './agente/tipos/tipo/tipo.component';
import { ClaseItemComponent } from './agente/tipos/tipo/clase-item/clase-item.component';
import { TipoBodyComponent } from './agente/tipos/tipo/tipo-body/tipo-body.component';
import { TipoSelectorComponent } from './agente/tipos/tipo-selector/tipo-selector.component';
import { MensajesComponent } from './agente/mensajes/mensajes.component';
import { SugerenciasComponent } from './agente/mensajes/mensaje/entrenamiento/respuestas/respuesta-card/res-style/sugerencias/sugerencias.component';
import { CardComponent } from './agente/mensajes/mensaje/entrenamiento/respuestas/respuesta-card/res-style/card/card.component';
import { ColeccionesComponent } from './agente/colecciones/colecciones.component';
import { TarjetasComponent } from './agente/tarjetas/tarjetas.component';
import { ColeccionComponent } from './agente/colecciones/coleccion/coleccion.component';
import { AddColeccionComponent } from './agente/colecciones/add-coleccion/add-coleccion.component';
import { DelColeccionComponent } from './agente/colecciones/del-coleccion/del-coleccion.component';
import { BusquedaColeccionComponent } from './agente/colecciones/coleccion/busqueda-coleccion/busqueda-coleccion.component';
import { TarjetaEditComponent } from './agente/tarjetas/tarjeta-edit/tarjeta-edit.component';
import { EstaticaTarjetaComponent } from './agente/tarjetas/estatica-tarjeta/estatica-tarjeta.component';
import { ColeccionTarjetaComponent } from './agente/tarjetas/coleccion-tarjeta/coleccion-tarjeta.component';



@NgModule({
  declarations: [
    AgentesComponent,
    AgenteComponent,
    InitAgenteComponent,
    FormAgregarAgenteComponent,
    FormCrearAgenteComponent,
    AccionesComponent,
    ContextosComponent,
    AddContextoComponent,
    ContextoComponent,
    MensajesByContextoComponent,
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
    DelMensajeDialogComponent,
    OpcionesComponent,
    RespuestasComponent,
    RespuestaCardComponent,
    BuscarFormComponent,
    CondicionalFormComponent,
    GrupoDatosComponent,
    PredefinidaFormComponent,
    TiposComponent,
    AddTipoComponent,
    AddClaseComponent,
    TipoComponent,
    ClaseItemComponent,
    TipoBodyComponent,
    TipoSelectorComponent,
    MensajesComponent,
    SugerenciasComponent,
    CardComponent,
    ColeccionesComponent,
    TarjetasComponent,
    ColeccionComponent,
    AddColeccionComponent,
    DelColeccionComponent,
    BusquedaColeccionComponent,
    TarjetaEditComponent,
    EstaticaTarjetaComponent,
    ColeccionTarjetaComponent,
  ],
  imports: [
    CommonModule,
    AgentesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ColorThemeModule,
    GdevResponsiveModule,
    GdevTextModule,
  ],
  providers: [
    
  ]
})
export class AgentesModule { }
