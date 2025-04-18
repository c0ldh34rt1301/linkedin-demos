package chatbot.chatbot.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import chatbot.chatbot.handler.StreamChatHandler;
import chatbot.chatbot.service.OpenAiService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.FluxSink;

@RestController
@RequestMapping(value = "/api")
public class ChatController {

    // Store active conversations using a UUID as the key and message as the value.
    private Map<String, String> conversations = new HashMap<>();

    
    /**
     * Accepts a user message via POST, starts the streaming generation,
     * and returns a conversationId for SSE subscription.
     */
    @PostMapping("/chat")
    public ResponseEntity<String> simpleChat(@RequestBody String message) {

        // Generate a unique ID for this conversation
        String conversationId = UUID.randomUUID().toString();

        // Store the message so it can be accessed during the streaming phase
        conversations.put(conversationId, message);

         // Return the conversation ID to the client to start listening for stream response
        return ResponseEntity.ok(conversationId);
    }

    /**
     * Handles Server-Sent Events (SSE) using the conversationId.
     * This endpoint allows the frontend to stream the partial responses.
     */
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamChat(@RequestParam String conversationId) {

        // Create a Flux that will push data to the client over SSE
        return Flux.create((FluxSink<String> sink) -> {
            
            // Retrieve the message associated with the conversation
            String message = conversations.get(conversationId);

            
            // Initialize the OpenAI service and attach the message to it
            OpenAiService service = new OpenAiService();

            // Create a handler to receive partial responses from streaming AI
            StreamChatHandler handler = new StreamChatHandler(sink);

            // Start streaming the AI response
            service.stream(message, handler);

            // Remove the conversaion from the conversations map
            conversations.remove(conversationId);

        }, FluxSink.OverflowStrategy.BUFFER); // Use buffering strategy to avoid backpressure issues
    }
}