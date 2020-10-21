import { NgModule } from '@angular/core';
import { ComunesModule, } from './comunes.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// *Global modules
import { MaterialModule, } from "./material.module";
import { FirebaseModule, } from './firebase.module';

// *ROOT modules
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// *Public modules
import { PublicModule, } from "./public/public.module";
import { PublicRoutingModule, } from "./public/public-routing.module";

// * Admin modules
import { AdminModule, } from './admin/admin.module';
import { AdminRoutingModule, } from "./admin/admin-routing.module";
import { AuthModule, } from './admin/auth/auth.module';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoadingModule } from './Gdev-Tools/loading/loading.module';
import { GdevAlertModule } from './Gdev-Tools/alerts/gdev-alert.module';

// * RX
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { mensajeReducer } from './public/components/agentes/agente/mensajes/mensaje/store/mensaje.reducer';
import { mensajeMap } from './public/components/agentes/agente/mensajes/mensaje/store/mensaje.state';
import { appReducers } from './app.state';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ComunesModule,
    MaterialModule,
    FirebaseModule,
    GdevAlertModule,
    PublicModule,
    PublicRoutingModule,
    AdminModule,
    AdminRoutingModule,
    AuthModule,
    LoadingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument( { maxAge: 25, logOnly: environment.production } ),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
