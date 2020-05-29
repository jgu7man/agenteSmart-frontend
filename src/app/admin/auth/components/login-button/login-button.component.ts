import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'aSmart-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss']
})
export class LoginButtonComponent implements OnInit {
  private agente = null;
  constructor(
    public dialog: MatDialog,
    public _auth: AuthService
  ) { }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginButtonDialog, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this._auth.openPopup().subscribe( res => {
        console.log( 'se autenticó' )
        console.log(res)
      })
    });
  }
  createAgent(): void {
    let projectName = "prueba07", 
      projectId = "prueba07-a230",
      agentName = "nuevoagente07"
    this._auth.createNewAgent(projectName,projectId, agentName).subscribe(data => {
      console.log(data);
      this.agente = data;
    }) 
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
