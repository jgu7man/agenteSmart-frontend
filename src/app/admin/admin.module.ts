import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from "./admin-routing.module";
import { GdevAlertModule } from '../gdev-tools/alerts/gdev-alert.module';



@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    GdevAlertModule
  ],
})
export class AdminModule { }
