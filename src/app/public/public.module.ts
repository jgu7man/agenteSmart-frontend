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




@NgModule({
  declarations: [
    lowecaseDirective,
    NormalizeDirective,
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
