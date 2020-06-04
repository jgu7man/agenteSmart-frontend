import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { ColorService } from './color.service';

@Directive({
  selector: '[gdev-color]',
})
export class ColorDirective implements OnInit {

  @Input() background: 'primary' | 'acent' | 'dark' | 'danger' | 'bg1' | 'bg2' | 'bg3' | 'complement1' | 'complement2' | string
  @Input() color: 'primary' | 'acent' | 'dark' | 'danger' | 'bg1' | 'bg2' | 'bg3' | 'complement1' | 'complement2' | string
  
  paletteTypes: string[]
  constructor (
    private el: ElementRef,
    private _color: ColorService
  ) {
    this.paletteTypes = Object.keys(this._color.ColorPalette)
   }
  
  ngOnInit() {
    this.setColor()
    this.setBackground()
  }

  setColor() {
    if ( this.color ){
      if (this.paletteTypes.includes(this.color)) {
        this.el.nativeElement.style.color = this._color.ColorPalette[ this.color ]
      } else {
        this.el.nativeElement.style.color = this.color
      }
    }
  }

  setBackground() {
    if ( this.background ){
      if (this.paletteTypes.includes(this.background)) {
        this.el.nativeElement.style.background = this._color.ColorPalette[ this.background ]
      } else {
        this.el.nativeElement.style.background = this.background
      }
    }
  }

}
