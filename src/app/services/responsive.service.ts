import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {


  public smallWidth
  public medWidth
  public largeWidth
  public extraLargeWidth
  public stretchHeight
  public fullHeight = window.innerHeight
  public fullWidth = window.innerWidth

  constructor () {
    this.smallWidth = 450
    this.medWidth = 700
    this.largeWidth = 1380
    this.extraLargeWidth = 1600

    this.stretchHeight = this.small ? 
      window.innerHeight - 64 - 49 :
      window.innerHeight - 64
    
  }

  get small() {
    return window.screen.width < this.smallWidth ? true : false
  }

  get med() {
    return window.screen.width < this.medWidth ? true : false
  }

  get large() {
    return window.screen.width < this.largeWidth ? true : false
  }

  strechHeigth( el: ElementRef ) {
    var y = el.nativeElement.getBoundingClientRect().y
    var height = this.deviceSize != 'small' ?
      this.fullHeight - y - 10 : this.fullHeight - y - 49

    console.log( y, height );
    el.nativeElement.style.height = height + 'px'
    
  }

  public get deviceSize() {
    if ( this.fullWidth < this.smallWidth ) {
      return 'small'
    } else if ( this.fullWidth < this.medWidth && this.fullWidth > this.largeWidth ) {
      return 'med'
    } else if ( this.fullWidth < this.largeWidth && this.fullWidth > this.extraLargeWidth ) {
      return 'large'
    } else if ( this.fullWidth > this.largeWidth ) {
      return 'extraLarge'
    }
  }

  
}
