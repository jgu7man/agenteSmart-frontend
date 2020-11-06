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
            name: 'Agente', route: undefined, routeId: 'agentes',icon: 'fa-project-diagram',  childs:
                [
                    { name: 'Crear agente', route: '/dashboard/crear_agente', routeId: 'crear_agente', },
                    { name: 'Agentes creados', route: '/dashboard/agentes', routeId: 'agentes', },
                ],
        },
        { name: 'Colecciones', route: 'colecciones', routeId: 'clientes', icon:'fa-folder' },
        { name: 'Tarjetas', route: 'tarjetas', routeId: 'clientes', icon: 'fa-window-restore' },
        { name: 'Inventario', route: 'inventario', routeId: 'inventario', icon: 'fa-boxes' },
        { name: 'Integraciones', route: 'integraciones', routeId: 'integraciones', icon: 'fa-plug' },
        { name: 'Clientes', route: 'clientes', routeId: 'clientes', icon:  'fa-users'},
        { name: 'Finanzas', route: 'finanzas', routeId: 'finanzas', icon: 'fa-receipt' },
    ];
  }

  

  

}

interface PARENT{
  name: string,
  route: string,
  routeId: string,
  childs?: CHILD[],
  icon?: string
}

interface CHILD {
  name: string,
  route: string,
  routeId: string
}
