import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CodeGetterComponent } from './auth/components/code-getter/code-getter.component';
import { GetAuthComponent } from './auth/components/get-auth/get-auth.component';


const routes: Routes = [
  {path: 'appadmin', component: AdminComponent, children: [
    // ? Rutas de autenticación
    { path: 'code', component: CodeGetterComponent },
    { path: 'auth', component: GetAuthComponent},
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
export class AdminRoutingModule { }
