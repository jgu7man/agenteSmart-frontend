import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from "./admin-routing.module";
import { GdevAlertServiceModule } from '../Gdev-Tools/alerts/gdev-alert-service.module';



@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    GdevAlertServiceModule
  ],
})
export class AdminModule { }
