import { Injectable } from "@angular/core";
import { Subject, Observable } from 'rxjs';

@Injectable( { providedIn: 'root' } )
export class Loading {

    waitFor = (ms) => new Promise(r => setTimeout(r, ms))

    on$: any = false
    animation$: any = false

    turnOn( animation?: string ) {
        this.on$ = true
        this.animation$ = animation ? animation : ''
    }

    async turnOff( animation?: string ) {
        await this.waitFor(1000)
        this.animation$ = animation ? animation : ''
        await this.waitFor(1000)
        this.on$ = false
    }

    


}