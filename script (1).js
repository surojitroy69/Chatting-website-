document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const clearButton = document.getElementById('clear-button');
    const emojiContainer = document.getElementById('emoji-container');
    const typingIndicator = document.getElementById('typing-indicator');
    const userNameInput = document.getElementById('user-name');
    const avatarContainer = document.querySelector('.avatar-container');
    let selectedAvatar = 'avatar1.png';

    // Load chat history from localStorage
    const loadChatHistory = () => {
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        chatHistory.forEach(({ user, message, time, avatar }) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.innerHTML = `
                <img src="${avatar}" alt="Avatar" class="avatar"> 
                <span class="user">${user}:</span> ${message} 
                <span class="timestamp">${time}</span> 
                <span class="actions" onclick="editMessage(this)">Edit</span>
                <span class="actions" onclick="deleteMessage(this)">Delete</span>
            `;
            chatBox.appendChild(messageDiv);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    loadChatHistory();

    const saveMessage = (user, message) => {
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        chatHistory.push({ user, message, time: new Date().toLocaleTimeString(), avatar: selectedAvatar });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    };

    const updateTypingIndicator = (typing) => {
        typingIndicator.textContent = typing ? 'Typing...' : '';
    };

    sendButton.addEventListener('click', () => {
        const userName = userNameInput.value.trim() || 'Anonymous';
        const message = messageInput.value.trim();
        if (message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.innerHTML = `
                <img src="${selectedAvatar}" alt="Avatar" class="avatar"> 
                <span class="user">${userName}:</span> ${message} 
                <span class="timestamp">${new Date().toLocaleTimeString()}</span> 
                <span class="actions" onclick="editMessage(this)">Edit</span>
                <span class="actions" onclick="deleteMessage(this)">Delete</span>
            `;
            chatBox.appendChild(messageDiv);
            messageInput.value = '';
            chatBox.scrollTop = chatBox.scrollHeight;

            saveMessage(userName, message);
            updateTypingIndicator(false);
        }
    });

    clearButton.addEventListener('click', () => {
        localStorage.removeItem('chatHistory');
        chatBox.innerHTML = '';
    });

    emojiContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('emoji')) {
            messageInput.value += e.target.dataset.emoji;
            messageInput.focus();
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    messageInput.addEventListener('input', () => {
        updateTypingIndicator(messageInput.value.trim() !== '');
        // Simulate a delay for incoming messages
        setTimeout(() => updateTypingIndicator(false), 3000);
    });

    avatarContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('avatar')) {
            document.querySelectorAll('.avatar').forEach(el => el.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedAvatar = e.target.dataset.avatar;
        }
    });
});

function editMessage(element) {
    const messageDiv = element.parentElement;
    const messageText = messageDiv.querySelector('.user').nextSibling.textContent.trim();
    const newMessage = prompt('Edit your message:', messageText);
    if (newMessage !== null) {
        messageDiv.querySelector('.user').nextSibling.textContent = ` ${newMessage}`;
        // Update localStorage here if needed
    }
}

function deleteMessage(element) {
    if (confirm('Are you sure you want to delete this message?')) {
        const messageDiv = element.parentElement;
        messageDiv.remove();
        // Update localStorage here if needed
    }
}
