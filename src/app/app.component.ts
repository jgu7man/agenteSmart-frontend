import { Component, OnInit, ElementRef } from '@angular/core';
import { GdevColor } from './gdev-tools/src/lib/color/gdev-color.service';
import { GdevCache } from './gdev-tools/src/lib/cache/gdev-cache.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'AgenteSmart-frontend';

  constructor (
    private _color: GdevColor,
    private body: ElementRef,
    private _cache: GdevCache
  ) {
    this._cache.cacheTagName = 'as-data'
    this._color.ColorPalette = {
        primary: '#3079F1',
        accent: '#EFA130',
        dark: '#141e66',
        danger: '',
        bg1: '#CCE1FF',
        bg2: '#FFF4E6',
        bg3: '#F3F8FF',
        complement1: '#1F5699',
        complement2: '',
        complement3: '',
        complement4: ''
      }
  }
  
  ngOnInit() {
    this.body.nativeElement.style.background = this._color
  }
}
