import { Component, OnInit } from '@angular/core';
import { IntegracionesService } from '../integraciones.service';

@Component({
  selector: 'aSmart-whatsapp-int',
  templateUrl: './whatsapp-int.component.html',
  styleUrls: ['./whatsapp-int.component.scss']
})
export class WhatsappIntComponent implements OnInit {

  waCode:string
  constructor (
    private _integration: IntegracionesService
  ) { }

  ngOnInit(): void {
  }


  requestCode() {
    this._integration.getQRCode().subscribe( response => {
      this.waCode = response['code']
    })
  }

}
