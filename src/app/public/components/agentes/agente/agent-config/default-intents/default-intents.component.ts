import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgentConfigService } from '../agent-config.service';
import { ConfigRetrocesoComponent } from '../config-retroceso/config-retroceso.component';

@Component({
  selector: 'aSmart-default-intents',
  templateUrl: './default-intents.component.html',
  styleUrls: ['./default-intents.component.scss']
})
export class DefaultIntentsComponent implements OnInit {

  constructor (
    public opciones_: AgentConfigService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openConfigFallback() {
    var dialog = this._dialog.open(ConfigRetrocesoComponent, {
      width: '33%'
    })
  }

}
