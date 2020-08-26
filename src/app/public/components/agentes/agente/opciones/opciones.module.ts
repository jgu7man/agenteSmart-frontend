import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpcionesRoutingModule } from './opciones-routing.module';
import { OpcionesComponent } from './opciones.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';


@NgModule( {
  declarations: [
    OpcionesComponent
  ],
  imports: [
    CommonModule,
    OpcionesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ]
})
export class OpcionesModule { }
