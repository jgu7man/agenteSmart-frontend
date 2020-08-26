import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from "./admin-routing.module";
import { GdevAlertaServiceModule } from '../Gdev-Tools/alerts/gdev-alerta-service.module';



@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    GdevAlertaServiceModule
  ],
})
export class AdminModule { }
