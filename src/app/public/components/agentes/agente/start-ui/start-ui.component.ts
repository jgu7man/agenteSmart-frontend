import { GdevCache } from './../../../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';

@Component({
  templateUrl: './start-ui.component.html',
  styleUrls: ['./start-ui.component.scss']
})
export class StartUiComponent implements OnInit {

    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _fs: AngularFirestore,
        private _cache: GdevCache,
        private _router: Router,
        private _alerts: GdevAlert
    ) { }

    ngOnInit() {
      this.firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required]
      });
      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required]
      });
    }


    setStarted() {
        const projectId: string = this._cache.getDataKey('projectId');
        const clientId: string = this._cache.getDataKey('user')['uid']
        if (projectId && clientId) {
            this._fs.doc(`usuarios/${clientId}/agentes/${projectId}`)
                .get().subscribe(agente => {
                    agente.ref.update({ started: true })
                    .then(() => {
                        console.log('creado')
                        this._cache.updateData('currentAgente',agente.data())
                        // this._router.navigate(['../bienvenida'])
                    })
                    .catch(error => {
                        console.error(error);
                        // this._router.navigate(['../bienvenida'])
                        this._alerts.sendFloatNotification('No se pudo actualizar el tutorial, todo lo demás está bien')
                    })
                })
        } else {
            this._alerts.sendFloatNotification('No se pudo actualizar el tutorial, todo lo demás está bien')
        }
    }
}
