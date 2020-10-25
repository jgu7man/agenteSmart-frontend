import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PublicComponent } from './public.component';
import { AgentesComponent } from './components/agentes/agentes.component';
import { InitAgenteComponent } from './components/agentes/init-agente/init-agente.component';
import { AgenteComponent } from './components/agentes/agente/agente.component';
import { MensajesByContextoComponent } from './components/agentes/agente/mensajes/mensajes-contexto/mensajes-contexto.component';
import { TiposComponent } from './components/agentes/agente/tipos/tipos.component';
import { AccionesComponent } from './components/agentes/agente/acciones/acciones.component';
import { OpcionesComponent } from './components/agentes/agente/opciones/opciones.component';
import { ContextosComponent } from './components/agentes/agente/contextos/contextos.component';
import { MensajeComponent } from './components/agentes/agente/mensajes/mensaje/mensaje.component';
import { MensajesComponent } from './components/agentes/agente/mensajes/mensajes.component';
import { ColeccionesComponent } from './components/agentes/agente/colecciones/colecciones.component';
import { TarjetasComponent } from './components/agentes/agente/tarjetas/tarjetas.component';
import { ProductsComponent } from './components/inventario/products/products.component';
import { AddProductComponent } from './components/inventario/products/add-product/add-product.component';
import { EditProductComponent } from './components/inventario/products/edit-product/edit-product.component';
import { EditAgenteComponent } from './components/agentes/edit-agente/edit-agente.component';

const routes: Routes = [
    {
        path: '', component: PublicComponent, children: [
            { path: 'dashboard', component: DashboardComponent, children: 
                [
                    { path: '', redirectTo: 'agentes', pathMatch: 'full' },
    
                    { path: 'agentes', component: AgentesComponent },
                    { path: 'crear_agente', component: InitAgenteComponent },
                    { path: 'editar_agente/:id', component: EditAgenteComponent, },
                    { path: 'agente/:id', component: AgenteComponent, children: 
                        [
                            { path: '', redirectTo: 'mensajes',pathMatch: 'full', },
                            { path: 'mensajes', component: MensajesComponent },
                            { path: 'mensaje/:name', component: MensajeComponent, },
                            { path: 'tipos', component: TiposComponent },
                            { path: 'opciones', component: OpcionesComponent },
                        ],
                    },
                    { path: 'tarjetas', component: TarjetasComponent },
                    { path: 'colecciones', component: ColeccionesComponent },
    
                    { path: 'inventario', component: ProductsComponent },
                    { path: 'products/add', component: AddProductComponent },
                    {
                        path: 'products/edit/:id',
                        component: EditProductComponent,
                    },
                ],
            },
        ],
    },
];

const routerOptions: ExtraOptions = {
    useHash: false,
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'disabled',
    onSameUrlNavigation: 'reload',
    paramsInheritanceStrategy: 'always',
};

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule],
})
export class PublicRoutingModule {}
