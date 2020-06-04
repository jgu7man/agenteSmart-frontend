import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColorService } from '../global/color-theme/color.service';

@Component({
  selector: 'aSmart-public',
  templateUrl: './public.component.html',
  styleUrls: [ './public.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class PublicComponent implements OnInit {

  
  constructor (
    private _color: ColorService
  ) { }

  ngOnInit() {
  }

}
