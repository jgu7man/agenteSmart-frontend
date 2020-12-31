import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatContainerComponent } from './components/chat-container/chat-container.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TypingAreaComponent } from './components/typing-area/typing-area.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { RemitterAreaComponent } from './components/remitter-area/remitter-area.component';
import { GdevToolsModule } from '../gdev-tools/gdev-tools.module';



@NgModule({
  declarations: [
    ChatContainerComponent,
    TypingAreaComponent,
    ConversationComponent,
    RemitterAreaComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GdevToolsModule
  ],
  exports: [
    ChatContainerComponent
  ]
})
export class ChatModule { }
