import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MensajesModule } from './agente/mensajes/mensajes.module';
import { AccionesModule } from './agente/acciones/acciones.module';
import { ContextosModule } from './agente/contextos/contextos.module';
import { OpcionesModule } from './agente/opciones/opciones.module';
import { RespuestasModule } from './agente/respuestas/respuestas.module';
import { TiposModule } from './agente/tipos/tipos.module';
import { AgentesComponent } from './agentes.component';
import { AgenteComponent } from './agente/agente.component';
import { InitAgenteComponent } from './init-agente/init-agente.component';
import { FormAgregarAgenteComponent } from './init-agente/form-agregar-agente/form-agregar-agente.component';
import { FormCrearAgenteComponent } from './init-agente/form-crear-agente/form-crear-agente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { AgentesRoutingModule } from './agentes-routing.module';
import { ColorThemeModule } from '../../../Gdev-Tools/color/color-theme.module';
import { GdevResponsiveModule } from '../../../Gdev-Tools/responsive/gdev-responsive.module';
import { GdevTextModule } from '../../../Gdev-Tools/text/gdev-text.module';



@NgModule({
  declarations: [
    AgentesComponent,
    AgenteComponent,
    InitAgenteComponent,
    FormAgregarAgenteComponent,
    FormCrearAgenteComponent,
  ],
  imports: [
    CommonModule,
    AgentesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MensajesModule,
    AccionesModule,
    ContextosModule,
    MensajesModule,
    OpcionesModule,
    RespuestasModule,
    TiposModule,
    ColorThemeModule,
    GdevResponsiveModule,
    GdevTextModule,
  ],
  providers: [
    
  ]
})
export class AgentesModule { }
