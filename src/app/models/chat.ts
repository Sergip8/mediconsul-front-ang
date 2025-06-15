import { ChatMessage } from "../public/views/chat/chat.component"

export interface ChatResponse{
    message: string
    conversationHistory: ChatMessage[]
    userId: number
}