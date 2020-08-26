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
import { ColorDirective } from '../../../global/color-theme/color.directive';
import { lowecaseDirective } from '../../../global/directives/lowercase.directive';
import { NormalizeDirective } from '../../../global/directives/normalize.directive';
import { ResponsiveDirective } from '../../../global/directives/responsive.directive';
import { StretchHeightDirective } from '../../../global/directives/stretchHeight.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { AgentesRoutingModule } from './agentes-routing.module';
import { DirectivesModule } from '../../../global/directives/directives.module';
import { ColorThemeModule } from '../../../global/color-theme/color-theme.module';



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
    DirectivesModule,
    MensajesModule,
    AccionesModule,
    ContextosModule,
    MensajesModule,
    OpcionesModule,
    RespuestasModule,
    TiposModule,
    ColorThemeModule,
  ],
  providers: [
    ColorDirective,
    lowecaseDirective,
    NormalizeDirective,
    ResponsiveDirective,
    StretchHeightDirective
  ]
})
export class AgentesModule { }
