import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {


  public smallWidth
  public medWidth
  public largeWidth
  public extraLargeWidth
  
  constructor () {
    this.smallWidth = 450
    this.medWidth = 700
    this.largeWidth = 1380
    this.extraLargeWidth = 1600
  }

  small() {
    return window.screen.width < this.smallWidth ? true : false
  }

  med() {
    return window.screen.width < this.medWidth ? true : false
  }

  large() {
    return window.screen.width < this.largeWidth ? true : false
  }
}
