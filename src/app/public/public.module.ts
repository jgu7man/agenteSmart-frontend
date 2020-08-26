import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComunesModule } from '../comunes.module';

import { PublicComponent } from './public.component';
import { MaterialModule } from "../material.module";
import { PublicRoutingModule } from "./public-routing.module";

import { LoginComponent } from './components/navbar/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthModule } from '../admin/auth/auth.module';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { AgentesComponent } from './components/agentes/agentes.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FormCrearAgenteComponent } from './components/agentes/init-agente/form-crear-agente/form-crear-agente.component';
import { FormAgregarAgenteComponent } from './components/agentes/init-agente/form-agregar-agente/form-agregar-agente.component';
import { InitAgenteComponent } from './components/agentes/init-agente/init-agente.component';
import { AlertModule } from '../global/alert/alert.module';
import { AgenteComponent } from './components/agentes/agente/agente.component';
import { ColorThemeModule } from '../global/color-theme/color-theme.module';
import { ColorDirective } from '../global/color-theme/color.directive';
import { EntradasComponent } from './components/agentes/agente/entradas/entradas.component';
import { TiposComponent } from './components/agentes/agente/tipos/tipos.component';
import { AccionesComponent } from './components/agentes/agente/acciones/acciones.component';
import { OpcionesComponent } from './components/agentes/agente/opciones/opciones.component';
import { lowecaseDirective } from '../global/directives/lowercase.directive';
import { NormalizeDirective } from '../global/directives/normalize.directive';
import { ResponsiveDirective } from '../global/directives/responsive.directive';
import { StretchHeightDirective } from '../global/directives/stretchHeight.directive';
import { EntradasListComponent } from './components/agentes/agente/entradas/entradas-list/entradas-list.component';
import { ContextosComponent } from './components/agentes/agente/contextos/contextos.component';
import { AddContextoComponent } from './components/agentes/agente/contextos/add-contexto/add-contexto.component';
import { ContextoComponent } from './components/agentes/agente/contextos/contexto/contexto.component';
import { EntradaComponent } from './components/agentes/agente/entradas/entrada/entrada.component';
import { EntradaFormComponent } from './components/agentes/agente/entradas/entrada/entrada-form/entrada-form.component';
import { EntradaRespManagerComponent } from './components/agentes/agente/entradas/entrada/entrada-resp-manager/entrada-resp-manager.component';
import { EntradaHeaderComponent } from './components/agentes/agente/entradas/entrada/entrada-form/entrada-header/entrada-header.component';
import { BreadcumsComponent } from './components/agentes/agente/entradas/entrada/entrada-form/breadcums/breadcums.component';
import { DelEntradaDialogComponent } from './components/agentes/agente/entradas/del-entrada-dialog/del-entrada-dialog.component';
import { FrasesFormComponent } from './components/agentes/agente/entradas/entrada/entrada-form/frases-form/frases-form.component';
import { FraseItemComponent } from './components/agentes/agente/entradas/entrada/entrada-form/frases-form/frase-item/frase-item.component';
import { AddTipoComponent } from './components/agentes/agente/tipos/add-tipo/add-tipo.component';
import { AddClaseComponent } from './components/agentes/agente/tipos/add-tipo/add-clase/add-clase.component';
import { TipoComponent } from './components/agentes/agente/tipos/tipo/tipo.component';
import { ClaseItemComponent } from './components/agentes/agente/tipos/tipo/clase-item/clase-item.component';
import { TipoBodyComponent } from './components/agentes/agente/tipos/tipo/tipo-body/tipo-body.component';
import { FraseParametersComponent } from './components/agentes/agente/entradas/entrada/entrada-form/frases-form/frase-parameters/frase-parameters.component';
import { ParametrosComponent } from './components/agentes/agente/entradas/entrada/entrada-form/parametros/parametros.component';
import { PartParameterComponent } from './components/agentes/agente/entradas/entrada/entrada-form/frases-form/frase-parameters/part-parameter/part-parameter.component';
import { TipoSelectorComponent } from './components/agentes/agente/tipos/tipo-selector/tipo-selector.component';
import { ParamValueComponent } from './components/agentes/agente/entradas/entrada/entrada-form/parametros/param-value/param-value.component';
import { ParamRowComponent } from './components/agentes/agente/entradas/entrada/entrada-form/parametros/param-row/param-row.component';
import { AddParameterComponent } from './components/agentes/agente/entradas/entrada/entrada-form/parametros/add-parameter/add-parameter.component';
import { RespuestaCardComponent } from './components/agentes/agente/entradas/entrada/entrada-resp-manager/respuesta-card/respuesta-card.component';
import { FijaResFormComponent } from './components/agentes/agente/entradas/entrada/entrada-resp-manager/respuesta-card/res-forms/fija-res-form/fija-res-form.component';
import { CondicionalResFormComponent } from './components/agentes/agente/entradas/entrada/entrada-resp-manager/respuesta-card/res-forms/condicional-res-form/condicional-res-form.component';
import { GrupoDatosComponent } from './components/agentes/agente/entradas/entrada/entrada-resp-manager/respuesta-card/res-forms/grupo-datos/grupo-datos.component';
import { BuscarFormComponent } from './components/agentes/agente/entradas/entrada/entrada-resp-manager/respuesta-card/res-forms/buscar-form/buscar-form.component';
import { BinarioFormComponent } from './components/agentes/agente/entradas/entrada/entrada-resp-manager/respuesta-card/res-forms/binario-form/binario-form.component';




@NgModule({
  declarations: [
    lowecaseDirective,
    NormalizeDirective,
    ResponsiveDirective,
    StretchHeightDirective,
    PublicComponent,
    LoginComponent,
    NavbarComponent,
    UsuariosComponent,
    AgentesComponent,
    DashboardComponent,
    SidenavComponent,
    FormCrearAgenteComponent,
    FormAgregarAgenteComponent,
    InitAgenteComponent,
    AgenteComponent,
    EntradasComponent,
    TiposComponent,
    AccionesComponent,
    OpcionesComponent,
    EntradasListComponent,
    ContextosComponent,
    AddContextoComponent,
    ContextoComponent,
    EntradaComponent,
    EntradaFormComponent,
    EntradaRespManagerComponent,
    EntradaHeaderComponent,
    BreadcumsComponent,
    DelEntradaDialogComponent,
    FrasesFormComponent,
    FraseItemComponent,
    AddTipoComponent,
    AddClaseComponent,
    TipoComponent,
    ClaseItemComponent,
    TipoBodyComponent,
    FraseParametersComponent,
    ParametrosComponent,
    PartParameterComponent,
    TipoSelectorComponent,
    ParamValueComponent,
    ParamRowComponent,
    AddParameterComponent,
    RespuestaCardComponent,
    FijaResFormComponent,
    CondicionalResFormComponent,
    GrupoDatosComponent,
    BuscarFormComponent,
    BinarioFormComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AuthModule,
    PublicRoutingModule,
    ComunesModule,
    AlertModule,
    ColorThemeModule
  ],
  providers: [
    ColorDirective
  ]
})
export class PublicModule { }
