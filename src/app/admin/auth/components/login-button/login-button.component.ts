import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AuthService } from '../../auth.service';
import { CacheService } from '../../../../gdev-tools/cache/cache.service';
import { Router } from '@angular/router';

@Component({
  selector: 'aSmart-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss']
})
export class LoginButtonComponent implements OnInit {
  private agente = null;
  @Output() isLogged: EventEmitter<any> = new EventEmitter()
  constructor(
    public dialog: MatDialog,
    public _auth: AuthService,
    private _cache: CacheService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._auth.user$.pipe().subscribe( user => {
      if ( user )
      {
        this.isLogged.emit( user )
        this._cache.updateData('user', user)
      }
      
    })
  }

  openDialog(): void {
    let user = this._cache.getDataKey( 'user' )
    if ( user ) {
      this._router.navigate(['/dashboard'])
    } else {
      const dialogRef = this.dialog.open(LoginButtonDialog, {
        width: '350px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this._auth.googleSingIn().then( res => {
          console.log( 'se autenticó' )
        })
      });

    }
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
