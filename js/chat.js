// =========================================================================
// SAKSHI'S AI ASSISTANT WIDGET
// =========================================================================

// PLEASE NOTE: In a production environment, you should never expose your API key
// directly in client-side Javascript. It should be securely stored on a backend server.
// For the purpose of this demonstration based on user request, it is implemented client-side.
const GEMINI_API_KEY = "AIzaSyDFfMQr_ukvyRP6N-Sz3FK7z7Iba5DPldg"; // Replace with actual key

const SYSTEM_PROMPT = `You are "Sakshi's AI Assistant", a friendly, human-like, and highly intelligent customer service AI for "The Frosting by Sakshi", a home bakery located in Kanpur, India. You must sound warm, polite, sweet, and helpful. Use emojis occasionally (like 🎂, 💖, ✨) but don't overdo it.

Here is all the data about the business you need to know to answer questions:

BUSINESS INFO
Name: The Frosting by Sakshi
Tagline: Freshly Home Baked
City: Kanpur, Uttar Pradesh, India
Instagram: @the_frosting999
Contact: +91 89349 35910 or +91 83030 02147
Delivery: Free within 2km, ₹8 per km after 2km.
Notice Period: Orders must be placed at least 1 day in advance. Urgent orders are accepted with an additional charge. Custom cake notice depends strictly on design complexity.
All cakes are 100% Eggless and made with premium homemade ingredients.
All Cake prices listed below are for 500g. Customization & delivery charges are extra.

MASTER MENU & PRICING
CAKES (₹399): Vanilla, Pineapple, Black Forest, Strawberry, Butterscotch, Coffee Cake
CAKES (₹449): Mango Cake, Chocolate, Coffee Mousse Cake
CAKES (₹499): Oreo Cake, Fruit Cake, Blueberry, Chocolate Mousse
CAKES (₹549): Gulab Jamun Cake, Chocolate Truffle

PREMIUM CAKES (₹549): Vanilla, Pineapple, Black Forest, Strawberry, Butterscotch, Coffee Cake
PREMIUM CAKES (₹599): Mango Cake, Chocolate, Coffee Mousse Cake
PREMIUM CAKES (₹649): Oreo Cake, Fruit Cake, Blueberry, Chocolate Mousse
PREMIUM CAKES (₹699): Gulab Jamun Cake, Chocolate Truffle

CLASSIC SIGNATURE CAKES: Rasmalai (₹549), Lemon Blueberry (₹549), Red Velvet (₹599), Lotus Biscoff (₹649)
PREMIUM SIGNATURE CAKES: Rasmalai (₹699), Lemon Blueberry (₹699), Red Velvet (₹749), Lotus Biscoff (₹799)

BENTO CAKES: Any flavour (₹199)

JAR CAKES: Pineapple / Black Forest / Chocolate (₹89), Blueberry / Rasmalai (₹99), Lotus Biscoff (₹149)

CLASSIC BROWNIES: Classic/Fudge (3pcs, ₹199), Oreo/Brookies/Double Chocolate (4pcs, ₹299/₹399/₹499), Walnut (6pcs, ₹499)
PREMIUM BROWNIES: Nutella/Red Velvet/Lotus Biscoff (1pc, ₹99), Hazelnut (1pc, ₹120), Triple Choc (6pcs, ₹549), Double/Triple Choc with Nuts (₹599)
SPECIAL BROWNIES: Assorted (₹549), Sizzler with Ice Cream (Dine-in, ₹249). (Healthy options available: Sugar-free, Gluten-free, Millet based).

CUPCAKES (Set of 6): Classic (₹249), Centre Filled (₹299)

COOKIES (Set of 6): Choco Chip (₹120), Double Choc (₹129), Triple Choc/Orange Choc Chunk (₹149), Naankhatai in Desi Ghee (₹199), Red Velvet Giant (₹299). (Healthy options available).

CHOCOLATE FUN: Cubes (10pcs ₹49, Flavoured 6pcs ₹49), Pinata/Lollipop/Centre Filled/Mendiants (Set of 6, ₹149-₹249), Designer Bar (₹199), Bar with Nuts (₹299)

TRUFFLES (Set of 6): Plain/Mint/Pina Colada/Paan/Gulkand (₹180). With Nuts: Mocha Walnut/Pistachio/Kaju Katli/Lemon Cheesecake (₹249)

TEA CAKES (500g): Tutti Frutti/Paan (₹399), Atta Jaggery/Ragi Banana/Orange (₹449), Masala Chai/Belgian Choc/Dates Walnut (₹499), Lemon White Choc (₹549)

CHEESECAKES: 8 Slices (₹999)
CAKESICLES: Set of 6 (₹199), Theme Set of 6 (₹299)
SPECIAL DESSERTS: Authentic Christmas Cake, Tiramisu.

RULES FOR YOUR RESPONSES:
1. Always be polite, warm, and concise. Do not give huge walls of text unless explicitly asked to list the whole menu.
2. If asked how to order or for contact info, provide the numbers as clickable links: [89349 35910](tel:+918934935910) and [83030 02147](tel:+918303002147).
3. If asked for Instagram, always provide the full direct URL: [https://instagram.com/the_frosting999](https://instagram.com/the_frosting999). Don't just give the ID.
4. If they ask a question outside the scope of the bakery, gently inform them you only assist with bakery inquiries.
5. Format your responses using markdown for readability where appropriate (bolding prices or item names).`;

document.addEventListener('DOMContentLoaded', () => {

    // Inject chat widget HTML into body
    const chatHTML = `
        <!-- AI Chat Button -->
        <button class="ai-chat-btn" id="ai-chat-btn" aria-label="Open AI Assistant">
            <i class="fas fa-comment-dots"></i>
        </button>

        <!-- AI Chat Window -->
        <div class="ai-chat-window" id="ai-chat-window">
            <div class="ai-chat-header">
                <div class="ai-chat-header-info">
                    <img src="images/ai_logo.jpg" alt="Assistant avatar">
                    <div>
                        <h4>Sakshi's AI Assistant</h4>
                        <p>Typically replies instantly</p>
                    </div>
                </div>
                <button class="ai-chat-close" id="ai-chat-close"><i class="fas fa-times"></i></button>
            </div>
            
            <div class="ai-chat-messages" id="ai-chat-messages">
                <div class="chat-msg bot">
                    <p>Hi there! 👋 I'm Sakshi's AI Assistant. How can I sweeten your day?</p>
                </div>
                <!-- Typing Indicator initially hidden -->
                <div class="ai-typing-indicator" id="ai-typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
            
            <div class="ai-chat-input-area">
                <input type="text" class="ai-chat-input" id="ai-chat-input" placeholder="Ask about our menu, prices, delivery...">
                <button class="ai-chat-send" id="ai-chat-send" disabled><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);

    // Elements
    const chatBtn = document.getElementById('ai-chat-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatClose = document.getElementById('ai-chat-close');
    const chatInput = document.getElementById('ai-chat-input');
    const chatSendBtn = document.getElementById('ai-chat-send');
    const chatMessagesContainer = document.getElementById('ai-chat-messages');
    const typingIndicator = document.getElementById('ai-typing-indicator');

    // Conversation History for context
    let conversationHistory = [
        {
            "role": "user",
            "parts": [{ "text": "Instruction for system: " + SYSTEM_PROMPT }]
        },
        {
            "role": "model",
            "parts": [{ "text": "Understood. I am Sakshi's AI Assistant, ready to help customers!" }]
        }
    ];

    // Toggle Chat Window
    chatBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
        chatBtn.classList.remove('has-notification');
        if (chatWindow.classList.contains('open')) {
            chatInput.focus();
        }
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    // Input Validation
    chatInput.addEventListener('input', () => {
        chatSendBtn.disabled = chatInput.value.trim() === '';
    });

    // Send Message on Enter Key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !chatSendBtn.disabled) {
            handleSendMessage();
        }
    });

    // Send Message on Button Click
    chatSendBtn.addEventListener('click', () => {
        if (!chatSendBtn.disabled) {
            handleSendMessage();
        }
    });

    async function handleSendMessage() {
        const userText = chatInput.value.trim();
        if (!userText) return;

        // Clear input and disable button
        chatInput.value = '';
        chatSendBtn.disabled = true;

        // Add user message to UI
        appendMessage(userText, 'user');

        // Add to history
        conversationHistory.push({
            "role": "user",
            "parts": [{ "text": userText }]
        });

        // Show typing indicator
        showTypingIndicator();

        // Call Gemini API
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "contents": conversationHistory,
                    "generationConfig": {
                        "temperature": 0.5,
                        "maxOutputTokens": 800,
                    }
                })
            });

            const data = await response.json();
            hideTypingIndicator();

            if (data.candidates && data.candidates.length > 0) {
                const botResponseText = data.candidates[0].content.parts[0].text;

                // Add to UI
                appendMessage(botResponseText, 'bot');

                // Add to history
                conversationHistory.push({
                    "role": "model",
                    "parts": [{ "text": botResponseText }]
                });
            } else {
                appendMessage("I'm sorry, I'm having trouble connecting right now. Please call us directly!", 'bot');
                console.error("Gemini API Error:", data);
            }

        } catch (error) {
            hideTypingIndicator();
            appendMessage("I'm sorry, I seem to be offline. Please call us at +91 89349 35910.", 'bot');
            console.error("Fetch Error:", error);
        }
    }

    function appendMessage(text, sender) {
        // Basic markdown to HTML conversion (bold, links, lists)
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Handle markdown links [text](url)
        formattedText = formattedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        // Handle raw URLs (if any slip through markdown)
        const urlRegex = /(?<!href=")(https?:\/\/[^\s<]+)/g;
        formattedText = formattedText.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');

        // Handle basic lists if Gemini returns them
        formattedText = formattedText.replace(/^\* (.*$)/gim, '<li>$1</li>');
        if (formattedText.includes('<li>')) {
            formattedText = formattedText.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
        }
        // Handle newlines
        formattedText = formattedText.replace(/\n/g, '<br/>');

        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;

        let p = document.createElement('p');
        p.innerHTML = formattedText;
        msgDiv.appendChild(p);

        // Add time
        const timeSpan = document.createElement('span');
        timeSpan.className = 'chat-msg-time';
        const now = new Date();
        timeSpan.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        msgDiv.appendChild(timeSpan);

        // Insert before the typing indicator
        chatMessagesContainer.insertBefore(msgDiv, typingIndicator);

        // Scroll to bottom
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        typingIndicator.classList.add('active');
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function hideTypingIndicator() {
        typingIndicator.classList.remove('active');
    }

    // Trigger notification pulse after a few seconds of loading page
    setTimeout(() => {
        if (!chatWindow.classList.contains('open')) {
            chatBtn.classList.add('has-notification');
        }
    }, 5000);

});
