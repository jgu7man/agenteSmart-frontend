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
    
  }
  
  ngOnInit() {
    this.body.nativeElement.style.background = this._color
  }
}
