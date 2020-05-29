import { NgModule} from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
// import { PublicComponent } from '../../../mii/src/app/public/public.component';
// import { AdminComponent } from '../mii/src/app/admin/admin.component';


const routes: Routes = [
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
export class AppRoutingModule { }
