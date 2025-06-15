import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../../public/views/chat/chat.component';
import { MarkdownParseService } from '../../../_core/services/markdown.service';



@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-3/4 max-h-screen bg-white rounded-lg shadow-md">
      <!-- Chat Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-sky-50">
        <div class="flex items-center">
          <div class="flex items-center justify-center w-10 h-10 rounded-full bg-sky-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-gray-800">{{ botName }}</h3>
            <div class="flex items-center">
              <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              <span class="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>
        <button 
          *ngIf="showCloseButton"
          (click)="onClose.emit()" 
          class="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Chat Messages -->
      <div #messageContainer class="flex-1 p-4 overflow-y-auto">
        <div *ngIf="messages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>{{ emptyStateMessage }}</p>
        </div>
        
        <div *ngFor="let message of messages" class="mb-4">
          <div class="flex" [ngClass]="{'justify-end': message.role =='user'}">
            <div class="max-w-3/4 rounded-lg px-4 py-2" 
                [ngClass]="{'bg-sky-500 text-white': message.role =='user', 'bg-gray-100 text-gray-800': message.role =='assistant'}">
              <p [innerHTML]="markdownService.parseToHtml(message.content) "> </p>
              <div class="text-xs mt-1 text-right" 
                  [ngClass]="{'text-sky-100': message.role =='user', 'text-gray-500': message.role =='assistant'}">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>
          </div>
        </div>
        
        <div *ngIf="isTyping" class="flex mb-4">
          <div class="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Chat Input -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center">
          <input
            type="text"
            [(ngModel)]="newMessage"
            (keydown.enter)="sendMessage()"
            placeholder="{{ inputPlaceholder }}"
            class="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            [disabled]="isDisabled"
          />
          <button
            (click)="sendMessage()"
            class="p-2 bg-sky-500 text-white rounded-r-lg hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            [disabled]="!newMessage.trim() || isDisabled"
          >
            <svg transform="rotate(90)" xmlns="http://www.w3.org/2000/svg" class="h-7 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ChatbotComponent implements OnInit {
  @Input() botName: string = 'Support Bot';
  @Input() messages: ChatMessage[] = [];
  @Input() emptyStateMessage: string = 'Send a message to start the conversation';
  @Input() inputPlaceholder: string = 'Type your message...';
  @Input() isTyping: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() showCloseButton: boolean = true;
  
  @Output() onSendMessage = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<void>();
  
  newMessage: string = '';
  
  constructor(public markdownService: MarkdownParseService){}

  ngOnInit() {
    this.scrollToBottom();
  }
  
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  
  sendMessage() {
    if (this.newMessage.trim() && !this.isDisabled) {
      this.onSendMessage.emit(this.newMessage);
      this.newMessage = '';
    }
  }
  
  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  scrollToBottom() {
    try {
      const messageContainer = document.querySelector('.overflow-y-auto');
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    } catch (err) { }
  }
}