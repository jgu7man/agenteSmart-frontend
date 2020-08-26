import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccionesComponent } from './acciones.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';



@NgModule({
  declarations: [
    AccionesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ]
})
export class AccionesModule { }
