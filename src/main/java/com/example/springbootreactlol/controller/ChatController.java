package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.data.ChatMessage;
import com.example.springbootreactlol.service.ChatService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@Tag(name = "Chat", description = "Chat management APIs")
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        chatService.addUser(chatMessage.getSender());
        sendConnectedUsers();

        // 환영 메시지 추가
        ChatMessage welcomeMessage = new ChatMessage();
        welcomeMessage.setType(ChatMessage.MessageType.JOIN);
        welcomeMessage.setSender("System");
        welcomeMessage.setContent(chatMessage.getSender() + "님이 입장하셨습니다.");
        messagingTemplate.convertAndSend("/topic/public", welcomeMessage);

        return chatMessage;
    }

    @MessageMapping("/chat.removeUser")
    @SendTo("/topic/public")
    public ChatMessage removeUser(@Payload ChatMessage chatMessage) {
        chatService.removeUser(chatMessage.getSender());
        sendConnectedUsers();

        // 퇴장 메시지 추가
        ChatMessage leaveMessage = new ChatMessage();
        leaveMessage.setType(ChatMessage.MessageType.LEAVE);
        leaveMessage.setSender("System");
        leaveMessage.setContent(chatMessage.getSender() + "님이 퇴장하셨습니다.");
        messagingTemplate.convertAndSend("/topic/public", leaveMessage);

        return chatMessage;
    }

    private void sendConnectedUsers() {
        messagingTemplate.convertAndSend("/topic/connectedUsers", chatService.getConnectedUsers());
    }
}
