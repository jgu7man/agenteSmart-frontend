import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'aSmart-get-auth',
  templateUrl: './get-auth.component.html',
  styleUrls: ['./get-auth.component.scss']
})
export class GetAuthComponent implements OnInit {

  auth: boolean
  constructor (
    private _auth: AuthService
  ) { }

  ngOnInit() {
    this._auth.authenticated$.subscribe( res => {
      this.auth = true
    })
  }

}
