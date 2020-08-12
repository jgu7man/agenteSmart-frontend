import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { EntradaModel } from '../../entrada.model';
import { EntradasService } from '../../entradas.service';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { CurrentEntradaService } from '../current-entrada.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'aSmart-entrada-form',
  templateUrl: './entrada-form.component.html',
  styleUrls: ['./entrada-form.component.scss']
})
export class EntradaFormComponent implements OnInit {

  entradaName: string
  entrada: EntradaModel

  constructor (
    public location: Location,
    private _entrada: CurrentEntradaService
  ) {}

  ngOnInit(): void {
    this.getEntrada()
    
  }

  async getEntrada() {
    this.entrada = ( await this._entrada.currentEntrada$.pipe( take( 1 ) ).toPromise() ).entrada
  }
  
  onSubmit() {
    
  }
  
  
  

  
  



}



