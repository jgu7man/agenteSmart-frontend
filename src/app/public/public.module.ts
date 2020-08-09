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
import { EntidadesComponent } from './components/agentes/agente/entidades/entidades.component';
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
    EntidadesComponent,
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
