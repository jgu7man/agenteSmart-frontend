import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'aSmart-code-getter',
  templateUrl: './code-getter.component.html',
  styleUrls: ['./code-getter.component.scss']
})
export class CodeGetterComponent implements OnInit {

  params:{} = {}
  constructor (
    private _url: ActivatedRoute,
    private _auth: AuthService
  ) { }

  async ngOnInit() {
    var waitFor = (ms) => new Promise( r => setTimeout(r, ms))
    var url = document.location.href
    var urlParamsSec = url.split( '?' )[1]
    var urlParams = urlParamsSec.split( '&' )
    var params = {}
    urlParams.forEach( param => {
      let keyValue = param.split( '=' )
      Object.defineProperty( params, keyValue[ 0 ], {
        value: keyValue[ 1 ], enumerable: true, writable: true, configurable: true,
      })
    } )

    await waitFor(1000)
    this._auth.authApi( params[ 'code' ] ).subscribe( res => {
      this._auth.authenticated$.next(res)
      localStorage.setItem('googleTokens', JSON.stringify(res))
    })
  }

}
