import { Injectable } from '@angular/core';
import { SystemEntitieModel } from '../../public/components/agentes/agente/tipos/tipo.model';

@Injectable({
  providedIn: 'root'
})
export class SystemEntitiesService {

  constructor () {}

  
  

  systemEntities: SystemEntitieModel[] = [
    {displayName: 'sys.date-time',
      ejemplos: [
        {request:"2:30 pm"},
        {request:"13 de julio"},
        {request:"abril"},
        {request:"esta mañana"},
        {request:"mañana a las 4:30 de la tarde"},
        {request:"mañana por la tarde"},
    ]},
    {displayName: 'sys.date',
      ejemplos: [
        {request:"mañana"},
    ]},
    {displayName: 'sys.date-period',
      ejemplos: [
        {request:"abril"},
        
    ]},
    {displayName: 'sys.time',
      ejemplos: [
        {request:"2:30 pm"},
      ]
    },
    {displayName: 'sys.time-period',
      ejemplos: [
        {request:"tarde"},
    ]},
    {displayName: 'sys.number',
      ejemplos: [
        {request: "uno"},
        {request: "veinte"},
    ]},
    {displayName: 'sys.unit-currency',
      ejemplos: [
        {request: "100 pesos"},
        {request: "10 dólares"},
      ]
    },
    {displayName: 'sys.percentage',
      ejemplos: [
        {request: "40%"},
        {request: "50 por ciento"}
    ]},
    {displayName: 'sys.duration',
      ejemplos: [
        {request: "15 minutos"},
        {request: "5 días"},
      ]
    },
    {displayName: 'sys.currency-name',
      ejemplos: [
        {request: "dólares"},
        {request: "libras"},
        {request: "pesos"},
    ]},
    {displayName: 'sys.address',
      ejemplos: [
        {request:"Plaza Pablo Ruiz Picasso, I Madrid 28020, España"},
    ]},
    {displayName: 'sys.zip-code',
      ejemplos: [
        {request: "46011"},
        {request: "06000"},
        {request: "X5003"},
    ]},
    {displayName: 'sys.geo-capital',
      ejemplos: [
        {request: "París"},
        {request:"Bogotá"},
    ]},
    {displayName: 'sys.geo-country',
      ejemplos: [
        {request: "Colombia"},
        {request: "México"},
      ]
    },
    {displayName: 'sys.geo-city',
      ejemplos: [
        {request: "Nueva York"},
        {request: "Bogotá"},
    ]},
    {displayName: 'sys.geo-state',
      ejemplos: [
        {request: "Andalucía"},
        {request: "Jalisco"},
    ]},
    {displayName: 'sys.location',
      ejemplos: [
        {request: "Plaza Pablo Ruiz Picasso, I"},
        {request:"Madrid 28020, España"},
    ]},
    {displayName: 'sys.email',
      ejemplos: [
        {request: "user@example.com"},
        {request:"example arroba gmail punto com"},
    ]},
    {displayName: 'sys.phone-number',
      ejemplos: [
        {request: "(123) 456 7890"},
        {request: "+1 (123) 456-7890"},
    ]},
    {displayName: 'sys.given-name',
      ejemplos: [
        {request: "Javier"},
        {request: "Rosa"},
    ]},
    {displayName: 'sys.last-name',
      ejemplos: [
        {request: "Martinez"},
        {request: "García"},
      ]
    },
    {displayName: 'sys.person',
      ejemplos: [
        {request:"Rosa García"},
        {request:"Rosa"},
        {request:"García"},
    ]},
    {displayName: 'sys.music-artist',
      ejemplos: [
        {request:"Beatles"},
        {request:"RHCP"},
    ]},
    {displayName: 'sys.music-genre',
      ejemplos: [
        {request:"Clásica"},
      ]
    },
    {displayName: 'sys.color',
      ejemplos: [
        {request:"magenta"},
        {request:"verde"},
    ]},
    {displayName: 'sys.language',
      ejemplos: [
        {request:"Japonés"},
        {request:"Inglés"},
    ]},
    {displayName: 'sys.url',
      ejemplos: [
        {request:"www.agentesmart.com"},
    ]},
    
  ]
}
