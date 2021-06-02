import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventarioRoutingModule } from './inventario-routing.module';
import { InventarioComponent } from './inventario.component';
import { ProductsComponent } from './products/products.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { DelProdcutComponent } from './products/del-prodcut/del-prodcut.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { ProdDetailsComponent } from './products/prod-details/prod-details.component';
import { GdevToolsModule } from '../../../gdev-tools/src/lib/gdev-tools.module';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportarComponent } from './importar/importar.component';
import { MxStorageModule } from '@marxa/storage-v9';


@NgModule({
  declarations: [
    InventarioComponent,
    ProductsComponent,
    AddProductComponent,
    DelProdcutComponent,
    EditProductComponent,
    ProdDetailsComponent,
    ImportarComponent
  ],
  imports: [
    CommonModule,
    InventarioRoutingModule,
    GdevToolsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MxStorageModule
  ]
})
export class InventarioModule { }
