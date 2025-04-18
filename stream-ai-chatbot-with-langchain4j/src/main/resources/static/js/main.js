// Bind event for the textbox: press Enter key to send message
$(document).ready(function() {
    var textbox = $('#user-input').get(0);
    textbox.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
            return;
          }
    });
});

// Sends the user's message to the server and handles the streamed response
async function sendMessage() {
    const inputBox = $('#user-input');
    const text = inputBox.val().trim();
    inputBox.val('');

    if (!text) return;

    // Render user message in UI
    renderUserMessage(text);

    // Send a POST request to the backend with the user message
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(text)
        });

        // Await and retrieve the conversation ID from the server response
        const conversationId = await response.text();

        // Start streaming the AI's response using SSE
        stream(conversationId);
    } catch (error) {
        // Handle any error during message sending or response retrieval
        console.error('Failed to send or receive message:', error);
        renderAIMessage('Error: Unable to contact server.');
    }
}

// Function to stream AI response using Server-Sent Events (SSE)
function stream(conversationId) {
    // Initially render an empty AI message to be updated progressively
    renderAIMessage('');

    // Open SSE connection to backend with conversation ID
    eventSource = new EventSource(`/api/stream?conversationId=${conversationId}`);

    // Listen for incoming SSE messages
    eventSource.onmessage = (event) => {
        try {
            // Parse the SSE message data (expected to be in JSON format)
            const data = JSON.parse(event.data);

            if (data.response) {
                // Append or replace the AI message content in the UI
                updateAIMessage(data.response, data.done);
            }

            if (data.done) {
                // Close the SSE connection once the message is fully received
                eventSource.close();
            }
        } catch (e) {
            console.error('Error parsing stream message:', e);
        }
    };

    // Handle SSE errors (e.g. connection drops)
    eventSource.onerror = (e) => {
        console.error('SSE connection error:', e);
        eventSource.close(); // Close the connection on error
        updateAIMessage('Error: connection lost.', true); // Show error in UI
    };
}

// Renders the user's message in the chat window
function renderUserMessage(message) {
    const messageElement = `
        <div class="flex items-start self-end float-right js-user-message mb-4 max-w-5xl">
            <div class="mr-4">
                <p class="bg-blue-500 p-3 rounded-lg text-white js-message-content">${message}</p>
            </div>
            <div class="w-10 min-w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white">U</div>
        </div>`;

    document.getElementById('message-list').insertAdjacentHTML('beforeend', messageElement);
}

// Renders the AI's response in the chat window
function renderAIMessage(message) {
    const messageElement = `
        <div class="flex items-start  js-ai-message mb-4 max-w-5xl">
            <div class="w-10 min-w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">A</div>
            <div class="ml-4">
                <p class="bg-gray-100 p-3 rounded-lg text-gray-800 js-message-content">${message}</p>
            </div>
        </div>`;

    document.getElementById('message-list').insertAdjacentHTML('beforeend', messageElement);
}

// Function to update the latest AI message with streamed content
function updateAIMessage(content, isFinal) {
    // Select all elements containing AI message content
    const aiMessages = document.querySelectorAll('.js-ai-message .js-message-content');
    if (aiMessages.length > 0) {
        // Get the most recently added AI message
        const lastMessage = aiMessages[aiMessages.length - 1];

        if (isFinal) {
            // If this is the final update, put the final content to the message
            lastMessage.innerHTML = content;
        } else {
            // Append the streamed chunk to the existing message content
            lastMessage.innerHTML += content;
        }
    }
}