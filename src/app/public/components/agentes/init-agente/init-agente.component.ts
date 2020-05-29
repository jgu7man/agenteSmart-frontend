import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'aSmart-init-agente',
  templateUrl: './init-agente.component.html',
  styleUrls: ['./init-agente.component.scss']
})
export class InitAgenteComponent implements OnInit {

  constructor(public responsive: ResponsiveService) { }

  ngOnInit() {
  }

}
