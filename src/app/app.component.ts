import { Component, OnInit, ElementRef } from '@angular/core';
import { ColorService } from './Gdev-Tools/color/color.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'AgenteSmart-frontend';

  constructor (
    private _color: ColorService,
    private body: ElementRef
  ) {
  }
  
  ngOnInit() {
    this.body.nativeElement.style.background = this._color
  }
}
