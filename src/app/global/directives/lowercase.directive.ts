import { Directive, ElementRef } from '@angular/core';

@Directive( {

    selector: '[lowecase]',
    host: {
        '(input)': 'ref.nativeElement.value=$event.target.value.toLowerCase()',
    }
})
export class lowecaseDirective {
    constructor ( private ref: ElementRef ) { }
 }