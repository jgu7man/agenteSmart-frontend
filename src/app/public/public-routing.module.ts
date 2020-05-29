import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PublicComponent } from './public.component';
import { AgentesComponent } from './components/agentes/agentes.component';
import { InitAgenteComponent } from './components/agentes/init-agente/init-agente.component';


const routes: Routes = [
  {
    path: '', component: PublicComponent, children: [
      {
        path: 'dashboard', component: DashboardComponent, children: [
          {
            path: 'agentes', component: AgentesComponent, children: [
              { path: 'init', component: InitAgenteComponent}
            ]}
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
