package chatbot.chatbot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import chatbot.chatbot.payload.ChatPayload;
import chatbot.chatbot.service.OpenAiService;

@RestController
@RequestMapping("/api")
public class ChatController {

    @PostMapping("/chat")
    public ResponseEntity<ChatPayload> simpleChat(@RequestBody String message) {

        // Create OpenAI service
        OpenAiService service = new OpenAiService();

        // Get result from OpenAI service
        String resultFromAI = service.generate(message);

        // Send the response 
        return ResponseEntity.ok(new ChatPayload(resultFromAI));
    }
}