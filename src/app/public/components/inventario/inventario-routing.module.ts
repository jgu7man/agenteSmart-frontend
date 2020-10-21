import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventarioComponent } from './inventario.component';
import { ProductsComponent } from './products/products.component';


const routes: Routes = [
  { path: '', component: InventarioComponent, children:[
    { path: '', pathMatch: 'full', redirectTo: 'productos' },
    { path: 'productos', component: ProductsComponent },
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
