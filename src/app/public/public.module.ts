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
import { GdevAlertModule } from '../Gdev-Tools/alerts/gdev-alert.module';
import { InventarioModule } from './components/inventario/inventario.module';
import { GdevToolsModule } from '../Gdev-Tools/gdev-tools.module';
import { ChatTesterModule } from './components/chat-tester/chat-tester.module';
import { ChatModule } from '../chat/chat.module';
import { InicioComponent } from './components/pages/inicio/inicio.component';
import { DocsComponent } from './components/pages/docs/docs.component';
import { TratamientoDatosComponent } from './components/pages/legal/tratamiento-datos/tratamiento-datos.component';
import { LegalComponent } from './components/pages/legal/legal.component';




@NgModule({
  declarations: [
    DashboardComponent,
    LoginComponent,
    NavbarComponent,
    PublicComponent,
    SidenavComponent,
    UsuariosComponent,
    InicioComponent,
    DocsComponent,
    TratamientoDatosComponent,
    LegalComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AuthModule,
    PublicRoutingModule,
    ComunesModule,
    AgentesModule,
    InventarioModule,
    GdevToolsModule,
    ChatTesterModule,
    ChatModule
  ],
  providers: [
  ]
})
export class PublicModule { }
