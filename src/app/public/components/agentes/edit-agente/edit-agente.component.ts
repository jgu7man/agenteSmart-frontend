import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentesService } from '../agentes.service';
import { AgenteModel, ImageUri } from '../init-agente/agente.model';
import { UserInterface } from '../../../../admin/auth/auth.service';
import { CacheService } from '../../../../Gdev-Tools/cache/cache.service';

@Component({
  selector: 'aSmart-edit-agente',
  templateUrl: './edit-agente.component.html',
  styleUrls: ['./edit-agente.component.scss']
})
export class EditAgenteComponent implements OnInit {

  projectId: string
  agente: AgenteModel
  user: UserInterface
  folder: string
  avatar: ImageUri = { url: '', alt: '' }

  constructor (
    private _route: ActivatedRoute,
    public agentes_: AgentesService,
    private _cache: CacheService
  ) {
    this.projectId = this._route.snapshot.params[ 'id' ]
    this.agente = new AgenteModel( '', '', 'es-419', 'America/New_York', '', this.avatar )
    this.user = this._cache.getDataKey( 'user' )
   }

  async ngOnInit() {
    this.agente = await this.agentes_.loadOneAgente( this.projectId )
    this.folder = `${ this.user.uid }/agentes/`
  }

  catchAvatarURL(url: ImageUri) {
    this.agente.avatarUri = url
  }
  
  onSubmit() {
    console.log( this.agente );
    this.agentes_.editAgent(this.agente)
  }
}
