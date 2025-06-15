import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient } from '../../models/patient';
import { AppointmentDetail, CitasTable, CreateCita } from '../../models/cita';
import {environment} from "../../../environments/environment";
import { ChatResponse } from '../../models/chat';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from '../../public/views/chat/chat.component';

const baseUrl = environment.baseUrl

export interface ChatConversation {
    id: string;
    userId: string;
    messages: ChatMessage[];
    createdAt: number;
    lastMessageAt: number;
    status: 'active' | 'archived' | 'deleted';
  }
  

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  constructor(private http: HttpClient) { 
    this.loadConversations();
  }

  getResponse(chat: ChatResponse){
    return this.http.post<any>(baseUrl+'Chat' ,chat)
  }
  private STORAGE_KEY = 'chat_conversations';

  // In-memory storage for active conversations
  private conversationsSubject = new BehaviorSubject<ChatConversation[]>([]);
  conversations$ = this.conversationsSubject.asObservable();


  // LOCAL STORAGE METHODS
  private loadConversations(): void {
    const storedConversations = localStorage.getItem(this.STORAGE_KEY);
    if (storedConversations) {
      try {
        const conversations: ChatConversation[] = JSON.parse(storedConversations);
        this.conversationsSubject.next(conversations);
      } catch (error) {
        console.error('Error parsing stored conversations:', error);
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  private saveConversationsToLocalStorage(): void {
    const conversations = this.conversationsSubject.value;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(conversations));
  }

  // CREATE NEW CONVERSATION
  createConversation(userId: string): ChatConversation {
    const newConversation: ChatConversation = {
      id: this.generateUniqueId(),
      userId,
      messages: [],
      createdAt: Date.now(),
      lastMessageAt: Date.now(),
      status: 'active'
    };

    const currentConversations = this.conversationsSubject.value;
    this.conversationsSubject.next([...currentConversations, newConversation]);
    this.saveConversationsToLocalStorage();

    return newConversation;
  }

  // ADD MESSAGE TO CONVERSATION
  addMessageToConversation(conversationId: string, message: ChatMessage): void {
    const conversations = this.conversationsSubject.value;
    const conversationIndex = conversations.findIndex(c => c.id === conversationId);

    if (conversationIndex !== -1) {
      // Add unique ID to message
     
      
      // Update conversation
      conversations[conversationIndex].messages.push(message);
      conversations[conversationIndex].lastMessageAt = Date.now();

      this.conversationsSubject.next([...conversations]);
      this.saveConversationsToLocalStorage();
    }
  }

  // GET CONVERSATION BY ID
  getConversationById(conversationId: string): ChatConversation | undefined {
    return this.conversationsSubject.value
      .find(conversation => conversation.id === conversationId);
  }

  // GET USER CONVERSATIONS
  getUserConversations(userId: string): ChatConversation[] {
    return this.conversationsSubject.value
      .filter(conversation => conversation.userId === userId);
  }

  // ARCHIVE CONVERSATION
  archiveConversation(conversationId: string): void {
    const conversations = this.conversationsSubject.value;
    const conversationIndex = conversations.findIndex(c => c.id === conversationId);

    if (conversationIndex !== -1) {
      conversations[conversationIndex].status = 'archived';
      this.conversationsSubject.next([...conversations]);
      this.saveConversationsToLocalStorage();
    }
  }

  // DELETE CONVERSATION
  deleteConversation(conversationId: string): void {
    const conversations = this.conversationsSubject.value
      .filter(conversation => conversation.id !== conversationId);

    this.conversationsSubject.next(conversations);
    this.saveConversationsToLocalStorage();
  }

  // CLEAR ALL CONVERSATIONS
  clearAllConversations(): void {
    this.conversationsSubject.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // UTILITY: GENERATE UNIQUE ID
  private generateUniqueId(): string {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ADVANCED: EXPORT CONVERSATIONS
  exportConversations(): string {
    return JSON.stringify(this.conversationsSubject.value, null, 2);
  }

  // ADVANCED: IMPORT CONVERSATIONS
  importConversations(jsonData: string): void {
    try {
      const conversations: ChatConversation[] = JSON.parse(jsonData);
      this.conversationsSubject.next(conversations);
      this.saveConversationsToLocalStorage();
    } catch (error) {
      console.error('Invalid conversation data:', error);
    }
  }
}

