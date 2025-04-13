package chatbot.chatbot.payload;

public class ChatPayload {

    public ChatPayload(String message) {
        this.message = message;
    }

    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}