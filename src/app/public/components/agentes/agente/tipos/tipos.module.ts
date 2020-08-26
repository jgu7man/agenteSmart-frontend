import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiposRoutingModule } from './tipos-routing.module';
import { TiposComponent } from './tipos.component';
import { AddTipoComponent } from './add-tipo/add-tipo.component';
import { AddClaseComponent } from './add-tipo/add-clase/add-clase.component';
import { TipoComponent } from './tipo/tipo.component';
import { ClaseItemComponent } from './tipo/clase-item/clase-item.component';
import { TipoBodyComponent } from './tipo/tipo-body/tipo-body.component';
import { TipoSelectorComponent } from './tipo-selector/tipo-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';


@NgModule({
  declarations: [
    TiposComponent,
    AddTipoComponent,
    AddClaseComponent,
    TipoComponent,
    ClaseItemComponent,
    TipoBodyComponent,
    TipoSelectorComponent
  ],
  imports: [
    CommonModule,
    TiposRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [
    TipoSelectorComponent
  ]
})
export class TiposModule { }
