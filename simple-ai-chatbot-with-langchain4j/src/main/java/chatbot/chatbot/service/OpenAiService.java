package chatbot.chatbot.service;

import dev.langchain4j.model.openaiofficial.OpenAiOfficialChatModel;

public class OpenAiService {

    private OpenAiOfficialChatModel chatModel;

    public OpenAiService() {
        // Get API Key from environment variable
        String apiKey = System.getenv("OPENAI_API_KEY");
        // Build OpenAI Chat model
        chatModel = OpenAiOfficialChatModel.builder()
            .apiKey(apiKey)
            .modelName("gpt-4o-mini")
            .build();
    }

    /**
     * Send a message to the OpenAI model and receive its response.
     * 
     * @param message The user message
     * @return Response from OpenAI service
     */
    public String generate(String message) {
        return chatModel.chat(message);
    }
}



