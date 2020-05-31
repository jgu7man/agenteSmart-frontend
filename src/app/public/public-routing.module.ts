import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PublicComponent } from './public.component';
import { AgentesComponent } from './components/agentes/agentes.component';
import { InitAgenteComponent } from './components/agentes/init-agente/init-agente.component';
import { AgenteComponent } from './components/agentes/agente/agente.component';


const routes: Routes = [
  {
    path: '', component: PublicComponent, children: [
      {
        path: 'dashboard', component: DashboardComponent, children: [
          // { path: '', redirectTo: 'agentes' },
          { path: 'agentes', component: AgentesComponent },
          { path: 'crear_agente', component: InitAgenteComponent },
          { path: 'agente/:id', component: AgenteComponent}
          ]}
        ]}
  ];


const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'disabled',
  onSameUrlNavigation: 'reload'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
