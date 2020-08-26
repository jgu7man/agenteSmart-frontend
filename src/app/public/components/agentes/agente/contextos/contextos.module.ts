import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContextosRoutingModule } from './contextos-routing.module';
import { ContextosComponent } from './contextos.component';
import { AddContextoComponent } from './add-contexto/add-contexto.component';
import { ContextoComponent } from './contexto/contexto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MensajesModule } from '../mensajes/mensajes.module';


@NgModule({
  declarations: [
    ContextosComponent,
    AddContextoComponent,
    ContextoComponent
  ],
  imports: [
    CommonModule,
    ContextosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MensajesModule
  ]
})
export class ContextosModule { }
