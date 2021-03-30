import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GdevColor } from '../gdev-tools/src/lib/color/gdev-color.service';

@Component({
  selector: 'aSmart-public',
  templateUrl: './public.component.html',
  styleUrls: [ './public.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class PublicComponent implements OnInit {

  
  constructor (
    private _color: GdevColor
  ) {
    this._color.ColorPalette = {
      primary: '#3079F1',
      accent: '#EFA130',
      dark: '#143666',
      danger: '#EE3333',
      bg1: '#CCE1FF',
      bg2: '#F3F8FF',
      bg3: '#FFF4E6',
      complement1: '#02060C',
      complement2: '#42CBFF',
      complement3: '#FFB769',
      complement4: '#99F724'
    }
   }

  ngOnInit() {
  }

}
