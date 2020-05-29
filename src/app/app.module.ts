import { NgModule } from '@angular/core';
import { ComunesModule, } from './comunes.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// *Global modules
import { MaterialModule, } from "./material.module";
import { FirebaseModule, } from './firebase.module';
import { AlertModule, } from './global/alert/alert.module';

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
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './admin/auth/interceptor.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

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
    AlertModule,
    PublicModule,
    PublicRoutingModule,
    AdminModule,
    AdminRoutingModule,
    AuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
