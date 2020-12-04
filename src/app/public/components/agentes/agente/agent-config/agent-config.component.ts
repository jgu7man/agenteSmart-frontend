import { Component, OnInit } from '@angular/core';
import { AgentConfigService } from './agent-config.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'aSmart-agent-config',
  templateUrl: './agent-config.component.html',
  styleUrls: ['./agent-config.component.scss']
})
export class AgentConfigComponent implements OnInit {

  constructor (
    public opciones_: AgentConfigService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  

}
