package com.example.springbootreactlol.socket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public String greeting(final String greeting) throws InterruptedException {
        Thread.sleep(1000);
        return "Hello " + greeting;
    }
}
