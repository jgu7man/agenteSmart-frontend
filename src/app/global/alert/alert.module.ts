import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from "src/app/material.module";
import { AlertComponent } from './alert.component';
import { MessageComponent } from './message/message.component';
import { AskComponent } from './ask/ask.component';



@NgModule({
  declarations: [
    AlertComponent,
    MessageComponent,
    AskComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  entryComponents: [
    MessageComponent,
    AskComponent,
  ]
})
export class AlertModule { }
