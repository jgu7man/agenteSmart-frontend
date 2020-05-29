import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { AuthAdminComponent } from './components/admin/auth-admin.component';
import { AuthPublicComponent } from './components/public/auth-public.component';
import { AuthGoogleButtonComponent } from './components/auth-google-button/auth-google-button.component';
import { LoginButtonComponent, LoginButtonDialog } from './components/login-button/login-button.component';
import { CodeGetterComponent } from './components/code-getter/code-getter.component';
import { GetAuthComponent } from './components/get-auth/get-auth.component';



@NgModule({
  declarations: [
    AuthAdminComponent,
    AuthPublicComponent,
    AuthGoogleButtonComponent,
    LoginButtonComponent,
    LoginButtonDialog,
    CodeGetterComponent,
    GetAuthComponent,
  ],
  entryComponents: [
    LoginButtonDialog
  ],
  exports: [
    LoginButtonComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class AuthModule { }
