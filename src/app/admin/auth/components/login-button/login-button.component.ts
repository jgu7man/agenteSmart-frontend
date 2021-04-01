import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'aSmart-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss']
})
export class LoginButtonComponent implements OnInit {

  /** Emite al navbar cuando el usuario se autenticó */
  @Output() isLogged: EventEmitter<any> = new EventEmitter()
  constructor(
    private _dialog: MatDialog,
    private _auth: AuthService,
    private _router: Router
  ) { }

  ngOnInit() {}

  // # OPEN LOGIN DIALOG
  /** Abre el cuadro de diálogo para que el usario inicie sesión en Google */
  openDialog(): void {
    this._dialog.open(LoginButtonDialog, {
      width: '350px',
    }).afterClosed().subscribe( () => {
      this._auth.googleSingIn().then( () => {
          this._router.navigate(['/dashboard'])
      })
    });
  }


}

@Component({
  selector: 'aSmart-login-button-dialog',
  templateUrl: './login-button-dialog.html'
})
export class LoginButtonDialog {

  constructor(
   public dialogRef: MatDialogRef<LoginButtonDialog>,
   ) {}

  onClick(): void {
    this.dialogRef.close();
  }

}
