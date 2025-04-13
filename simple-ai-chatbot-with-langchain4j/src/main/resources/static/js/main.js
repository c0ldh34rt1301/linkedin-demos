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

// Sends the user's message to the server and handles the response
async function sendMessage() {
    // Get the trimmed value of textbox then clear it
    const inputBox = $('#user-input');
    const text = inputBox.val().trim();
    inputBox.val('');

    if (!text) return;

    // Display user message in UI
    renderUserMessage(text);

    // The message object
    const message = { 'message': text.trim() };

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Tells server we're sending JSON
            },
            body: JSON.stringify(message)
        });

        const result = await response.json();
        renderAIMessage(result.message); // Show AI message
    } catch (error) {
        console.error('Failed to send or receive message:', error);
        renderAIMessage('Error: Unable to contact server.');
    }
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