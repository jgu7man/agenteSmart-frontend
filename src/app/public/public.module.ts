import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComunesModule } from '../comunes.module';

import { PublicComponent } from './public.component';
import { MaterialModule } from "../material.module";
import { PublicRoutingModule } from "./public-routing.module";

import { LoginComponent } from './components/navbar/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthModule } from '../admin/auth/auth.module';
import { UsuariosComponent } from './components/usuarios_/usuarios.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';


import { AgentesModule } from './components/agentes/agentes.module';
import { InventarioModule } from './components/inventario/inventario.module';
import { GdevToolsModule } from '../gdev-tools/src/lib/gdev-tools.module';
import { ChatTesterModule } from './components/chat-tester/chat-tester.module';
import { ChatModule } from '../chat/chat.module';
import { InicioComponent } from './components/pages/inicio/inicio.component';
import { DocsComponent } from './components/pages/docs/docs.component';
import { TratamientoDatosComponent } from './components/pages/legal/tratamiento-datos/tratamiento-datos.component';
import { LegalComponent } from './components/pages/legal/legal.component';
import { PageFooterComponent } from './components/page-footer/page-footer.component';
import { PreciosComponent } from './components/pages/precios/precios.component';
import { MessengerIntegrationComponent } from './components/pages/docs/messenger-integration/messenger-integration.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ClientInteractionComponent } from './components/clientes/client-interaction/client-interaction.component';




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
    PageFooterComponent,
    PreciosComponent,
    MessengerIntegrationComponent,
    ClientesComponent,
    ClientInteractionComponent,
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
