import { Injectable } from '@angular/core';

@Injectable({providedIn:'root'})
export class TextService {
    
    constructor () { }
    

    normalize(text: string) {
        var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
            to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
            mapping = {};
    
        for ( var i = 0, j = from.length; i < j; i++ )
            mapping[ from.charAt( i ) ] = to.charAt( i );
    
            var ret = [];
            for ( var i = 0, j = text.length; i < j; i++ ) {
                var c = text.charAt( i );
                if ( mapping.hasOwnProperty( text.charAt( i ) ) )
                    ret.push( mapping[ c ] );
                else
                    ret.push( c );
            }
            return ret.join( '' );
        

    }

}