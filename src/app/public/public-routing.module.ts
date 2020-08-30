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


const routes: Routes = [
  {
    path: '', component: PublicComponent, children: [
      {
        path: 'dashboard', component: DashboardComponent, children: [
          { path: '', redirectTo: 'agentes', pathMatch:'full' },
          { path: 'agentes', component: AgentesComponent },
          { path: 'crear_agente', component: InitAgenteComponent },
          {
            path: 'agente/:id', component: AgenteComponent, children: [
              { path: '', redirectTo: 'mensajes', pathMatch: 'full' },
              { path: 'mensajes', component: MensajesComponent },
              { path: 'mensaje/:name', component: MensajeComponent },
              { path: 'tipos', component: TiposComponent },
              { path: 'acciones', component: AccionesComponent },
              { path: 'opciones', component: OpcionesComponent },
          ] },
          ]}
        ]}
  ];


const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'disabled',
  onSameUrlNavigation: 'reload',
  paramsInheritanceStrategy: 'always'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
