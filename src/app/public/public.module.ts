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
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

import { ColorThemeModule } from '../Gdev-Tools/color/color-theme.module';

import { AgentesModule } from './components/agentes/agentes.module';
import { GdevResponsiveModule } from '../Gdev-Tools/responsive/gdev-responsive.module';
import { GdevTextModule } from '../Gdev-Tools/text/gdev-text.module';
import { GdevAlertaServiceModule } from '../Gdev-Tools/alerts/gdev-alerta-service.module';




@NgModule({
  declarations: [
    DashboardComponent,
    LoginComponent,
    NavbarComponent,
    PublicComponent,
    SidenavComponent,
    UsuariosComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AuthModule,
    PublicRoutingModule,
    ComunesModule,
    GdevAlertaServiceModule,
    ColorThemeModule,
    AgentesModule,
    GdevResponsiveModule,
    GdevTextModule,
  ],
  providers: [
  ]
})
export class PublicModule { }
