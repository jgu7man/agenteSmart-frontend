import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor () { }
  
  async updateData(key, value) {
    var sesData = {}
    sesData = JSON.parse( sessionStorage.getItem( 'as-data' ) )

    if ( key && value ) {

      if ( sesData ) {
        sesData[ key ] = value
        sessionStorage.setItem( 'as-data', JSON.stringify( sesData ) )
      } else {
        sesData = { [ key ]: value }
        sessionStorage.setItem( 'as-data', JSON.stringify( sesData ) )
      }

    } 

  }

  async getFullData() {
    
  }

  async getDataKey(key:string) {
    var sesData = JSON.parse( sessionStorage.getItem( 'as-data' ) )
    if ( sesData ) {
      return sesData[key] ? sesData[key] : null
    } else {
      return null
    }
  }

  
}

interface CacheData {
  key: string,
  value: any
}
