import { GdevLoading } from 'src/app/gdev-tools/src/lib/loading/loading.service';
import { Directive, ElementRef, Input, OnInit, AfterViewInit } from '@angular/core';

@Directive( {
    selector: '[strechHeight]',
})
export class StretchDirective implements OnInit{

    // @Input() hideOn: 'small' | 'med' | 'large' | 'extraLarge'
    // @Input() strechWidth: boolean = true
    // @Input() strechHeight: boolean = true

    public smallWidth = 450
    public medWidth = 700
    public largeWidth = 1380
    public extraLargeWidth = 1600
    public fullHeight = window.innerHeight
    public fullWidth = window.innerWidth


    constructor (
        private elementRef: ElementRef,
        private _loading: GdevLoading
    ) {
    }

    ngOnInit() {
        this.heightStreched()
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
    
    async heightStreched() {
        await this._loading.waitFor( 5000 )
        var y = this.elementRef.nativeElement.getBoundingClientRect().y
        console.log(this.elementRef.nativeElement.id);
        var height = this.deviceSize != 'small' ? 
            this.fullHeight - y : this.fullHeight - y - 49
        console.log(height);
        this.elementRef.nativeElement.style.height = height+'px'
            
    }

    // hide() {
    //     window.screen.width < this.smallWidth ? true : false
    //     this.elementRef.nativeElement.style.display = 'none';
    // }
}