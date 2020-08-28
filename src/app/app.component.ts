import { Component, OnInit, ElementRef } from '@angular/core';
import { ColorService } from './Gdev-Tools/color/color.service';
import { CacheService } from './Gdev-Tools/cache/cache.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'AgenteSmart-frontend';

  constructor (
    private _color: ColorService,
    private body: ElementRef,
    private _cache: CacheService
  ) {
    this._cache.cacheTagName = 'as-data'
  }
  
  ngOnInit() {
    this.body.nativeElement.style.background = this._color
  }
}
