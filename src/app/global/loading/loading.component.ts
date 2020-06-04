import { Component, OnInit } from '@angular/core';
import { Loading } from './loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor(public _load: Loading) { }

  ngOnInit() {
  }

}
