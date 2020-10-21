import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AgentesService } from '../agentes/agentes.service';
import { AgenteModel } from '../agentes/init-agente/agente.model';

@Component({
  selector: 'aSmart-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  agenteRoutes = []
  agentes: CHILD[]
  Sidenav: PARENT[]
  constructor (
    private location: Location,
    public _agentes: AgentesService
  ) {
    
    this.agenteRoutes = [  ]
   }

  ngOnInit() {
    this.setSidenav()
  }


  onActive( path ) {
    return this.location.path().includes( path )
  }

  setSidenav() {
    this.Sidenav = [
      {
        name: 'Agente',
        route: undefined,
        routeId: 'agentes',
        childs: [
          {
            name: 'Crear agente',
            route: '/dashboard/crear_agente',
            routeId: 'crear_agente'
          },
          {
            name: 'Agentes creados',
            route: '/dashboard/agentes',
            routeId: 'agentes'
          }
        ]
      },
      {
        name: 'Clientes',
        route: 'dashboard/clientes',
        routeId: 'clientes',
        childs: [

        ]
      },
      {
        name: 'Inventario',
        route: 'inventario',
        routeId: 'inventario',
        childs: [

        ],
      },
      {
        name: 'Integraciones',
        route: 'dashboard/integraciones',
        routeId: 'integraciones',
        childs: [

        ]
      },
      {
        name: 'Finanzas',
        route: 'dashboard/finanzas',
        routeId: 'finanzas',
        childs: [

        ]
      }
    ]
  }

  

  

}

interface PARENT{
  name: string,
  route: string,
  routeId: string,
  childs: CHILD[]
}

interface CHILD {
  name: string,
  route: string,
  routeId: string
}
