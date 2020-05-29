import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from "./admin-routing.module";
import { AlertModule } from '../global/alert/alert.module';



@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AlertModule
  ],
})
export class AdminModule { }
