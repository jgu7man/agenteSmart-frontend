import { Directive, ElementRef } from '@angular/core';

@Directive( {

    selector: '[normalize]',
    host: {
        '(input)': "ref.nativeElement.value=$event.target.value.normalize('NFD')"
    }
} )
export class NormalizeDirective {
    constructor ( private ref: ElementRef ) { }
}