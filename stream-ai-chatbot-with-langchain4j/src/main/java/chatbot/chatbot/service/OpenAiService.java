package chatbot.chatbot.service;

import chatbot.chatbot.handler.StreamChatHandler;
import dev.langchain4j.model.openaiofficial.OpenAiOfficialStreamingChatModel;

public class OpenAiService {

    private OpenAiOfficialStreamingChatModel chatModel;

    public OpenAiService() {
        // Get API Key from environment variable
        String apiKey = System.getenv("OPENAI_API_KEY");
        // Build OpenAI Chat model
        chatModel = OpenAiOfficialStreamingChatModel.builder()
            .apiKey(apiKey)
            .modelName("gpt-4o-mini")
            .build();
    }

    /**
     * Sends a message to the OpenAI chat model and streams the response using the given handler.
     *
     * @param message The input message from the user.
     * @param handler The handler that processes streaming responses from the model.
     */
    public void stream(String message, StreamChatHandler handler) {
        chatModel.chat(message, handler);
    }
}