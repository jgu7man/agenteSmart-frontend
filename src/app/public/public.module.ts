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

import { AlertModule } from '../global/alert/alert.module';
import { ColorThemeModule } from '../global/color-theme/color-theme.module';
import { ColorDirective } from '../global/color-theme/color.directive';

import { AgentesModule } from './components/agentes/agentes.module';
import { DirectivesModule } from '../global/directives/directives.module';




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
    AlertModule,
    ColorThemeModule,
    AgentesModule,
    DirectivesModule
  ],
  providers: [
    ColorDirective
  ]
})
export class PublicModule { }
