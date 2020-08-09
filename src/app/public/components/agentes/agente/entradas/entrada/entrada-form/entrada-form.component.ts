import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { EntradaModel } from '../../entrada.model';
import { EntradasService } from '../../entradas.service';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'aSmart-entrada-form',
  templateUrl: './entrada-form.component.html',
  styleUrls: ['./entrada-form.component.scss']
})
export class EntradaFormComponent implements OnInit {

  entradaName: string
  entrada: EntradaModel
  


  constructor (
    private _route: ActivatedRoute,
    private router: Router,
    private _entradas: EntradasService,
    private _dialog: MatDialog,
    public location: Location
  ) {
    this.entradaName = this._route.snapshot.paramMap.get( 'name' )
   }

  ngOnInit(): void {
    this.loadEntrada()
    this.router.events.subscribe( (val) => {
      if ( val instanceof NavigationEnd ) {
        this.entradaName = this._route.snapshot.paramMap.get( 'name' )
        this.loadEntrada()
      }
    })
  }
  
  
  
  

  async loadEntrada() {
    this.entrada = await this._entradas.getEntrada( this.entradaName )
  }
  


  onSubmit() {
    
  }

}



