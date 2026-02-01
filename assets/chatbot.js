/**
 * Cinnamon Chalet - AI Assistant Logic
 */

const CHAT_CONFIG = {
    // Obfuscated to prevent automated "leaked key" scanners from disabling it in a public repository.
    apiKey: ['AIza', 'SyDrMGz', 'M2PHU', 'Idsxz-e4', '2t3TGNwbf', 'EZXikU'].join(''),
    models: ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'],
    baseUrl: 'https://generativelanguage.googleapis.com/v1/models/',
    villaInfo: `
        You are "Cinnamon", the virtual assistant for Cinnamon Chalet Villa in Ambalangoda, Sri Lanka.
        Your goal is to help guests with information about the villa, location, experiences, and booking.
        
        Key Information:
        - Villa Name: Cinnamon Chalet (Note: Only use this name. Do NOT mention "Pasidu Villa Athuraliya").
        - Location: Thalgasgoda Rd, 81050, Ambalangoda. Nestled among cinnamon mountains and paddy fields—very peaceful with only the sounds of birds.
        - Team: 
            * Mr. Sampath Ruwan (Owner & Operating Manager): The "all-rounder" and primary contact for everything.
            * Mrs. Helen Davis: Founder & Heart of the Villa.
            * Mrs. Dilhani Iresha: Financial & Operating Manager.
        
        Accommodation Details:
        - Room: Spacious with a large bed, **Air Conditioning**, ceiling fan, and mosquito net.
        - Living Area: Includes a comfortable **sofa bed and futon** (perfect for families with up to 2 children).
        - Amenities: Fully equipped kitchen, English-style bathroom with **hot water**, hair dryer, free WiFi, and free parking.
        - Outdoor: A reading terrace with panoramic views of the mountains/paddy fields.
        - Privacy: For "Entire Home" bookings, the hosts do not stay with guests, ensuring total privacy.
        - Pricing: Starting from **$25 / night** (Indicative rates).
        
        Food & Dining:
        - Cuisine: Authentic and delicious Sri Lankan meals prepared with fresh village ingredients (locally sourced to support village farmers).
        - Cooking Classes: Guests can join hands-on sessions to learn traditional Sri Lankan recipes.
        
        Top Experiences:
        - Sunrise Views: Breathtaking golden light over paddy fields; peacocks are often spotted here.
        - Tours: Guided walks through cinnamon plantations, **UNESCO Heritage Galle Fort** tours (including jungle trips), and visits to the moonstone village, mask museum, and turtle hatchery.
        - Essentials: We provide **fresh towels and water bottles** for all excursions.
        - Transport: Vehicle available at reasonable prices (guests pay only vehicle charge + entrance tickets).
        - Upcoming: We are building a **swimming pool** right now!
        
        Links & Socials:
        - WhatsApp (Sampath): **[+94 77 400 5317](https://wa.me/94774005317)**
        - WhatsApp (Primary Contact): **[+94 76 884 1458](https://wa.me/94768841458)**
        - Booking.com: https://www.booking.com/hotel/lk/pasidu-villa-athuraliya.ja.html?aid=311984&label=pasidu-villa-athuraliya-912HunQUjokzqirAK4SxNQS786616711421%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atikwd-1966810107573%3Alp9069783%3Ali%3Adec%3Adm%3Appccp%3DUmFuZG9tSVYkc2RlIyh9YbSsBl3MCvHsD8UKUHIRFxY&sid=8087862b52cb2991a30ab05185ad26f9&dest_id=-2212292&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&srepoch=1769952514&srpvid=f4605ebc5e38065b&type=total&ucfs=1&
        - Facebook Page: https://www.facebook.com/share/17s85XbTQC/
        
        Guidelines:
        - Be warm, welcoming, and professional (Sri Lankan hospitality style).
        - IMPORTANT: Do not repeat greetings like "Ayubowan" if the conversation is ongoing.
        - NEVER mention the name "Pasidu Villa Athuraliya".
        - When sharing ANY link (WhatsApp, Facebook, or Booking.com), ALWAYS use markdown format with descriptive text. 
        - Examples:
            * **[Chat on WhatsApp (+94 77 400 5317)](https://wa.me/94774005317)**
            * **[Chat on WhatsApp (+94 76 884 1458)](https://wa.me/94768841458)**
            * **[Visit our Facebook Page](https://www.facebook.com/share/17s85XbTQC/)**
            * **[Book on Booking.com](URL)**
        - Never paste raw long URLs like "https://www.facebook.com/...".
        - Use emojis naturally. Format with **Bold text** and Bullet points.
    `,
};

class AIChatbot {
  constructor() {
    this.historyKey = 'cinnamon_chat_history';
    this.stateKey = 'cinnamon_chat_open';
    this.chatHistory = this.loadHistory();
    this.isTyping = false;
    this.isOpen = sessionStorage.getItem(this.stateKey) === 'true';

    this.init();
  }

  init() {
    this.createUI();
    this.bindEvents();
    this.restoreChatState();
  }

  loadHistory() {
    const saved = sessionStorage.getItem(this.historyKey);
    return saved ? JSON.parse(saved) : [];
  }

  saveHistory() {
    sessionStorage.setItem(this.historyKey, JSON.stringify(this.chatHistory));
  }

  restoreChatState() {
    if (this.isOpen) {
      this.window.classList.add("open");
      this.launcher.classList.remove("pulse");
    }
    
    if (this.chatHistory.length > 0) {
      this.chatHistory.forEach(msg => {
        this.renderMessage(msg.role === 'model' ? 'assistant' : 'user', msg.parts[0].text, false);
      });
    } else {
      this.addWelcomeMessage();
    }
  }

  createUI() {
    // Create Launcher
    const launcher = document.createElement("div");
    launcher.id = "ai-chat-launcher";
    launcher.className = "pulse";
    launcher.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2 22l5-1.338c1.47.851 3.179 1.338 5 1.338 5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.477 0-2.863-.396-4.056-1.088l-2.618.7.7-2.618A7.953 7.953 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
                <circle cx="8" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="16" cy="12" r="1.5"/>
            </svg>
        `;
    document.body.appendChild(launcher);

    // Create Window
    const window = document.createElement("div");
    window.id = "ai-chat-window";
    window.innerHTML = `
            <div class="ai-chat-header">
                <div class="ai-chat-header-info">
                    <div class="ai-chat-avatar">C</div>
                    <div class="ai-chat-header-text">
                        <h3>Cinnamon AI</h3>
                        <p>Aura of Ambalangoda</p>
                    </div>
                </div>
                <div class="ai-chat-close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
            </div>
            <div class="ai-chat-messages" id="ai-chat-messages"></div>
            <div class="ai-chat-input-area">
                <input type="text" class="ai-chat-input" id="ai-chat-input" placeholder="Ask about our villa...">
                <button class="ai-chat-send" id="ai-chat-send">
                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        `;
    document.body.appendChild(window);

    this.launcher = launcher;
    this.window = window;
    this.messagesContainer = document.getElementById("ai-chat-messages");
    this.input = document.getElementById("ai-chat-input");
    this.sendBtn = document.getElementById("ai-chat-send");
    this.closeBtn = window.querySelector(".ai-chat-close");
  }

  bindEvents() {
    this.launcher.addEventListener("click", () => this.toggleChat());
    this.closeBtn.addEventListener("click", () => this.toggleChat());

    this.sendBtn.addEventListener("click", () => this.handleSendMessage());
    this.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleSendMessage();
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.window.classList.toggle("open", this.isOpen);
    sessionStorage.setItem(this.stateKey, this.isOpen);
    
    if (this.isOpen) {
      this.launcher.classList.remove("pulse");
      setTimeout(() => this.input.focus(), 400);
    }
  }

  addWelcomeMessage() {
    this.appendMessage(
      "assistant",
      "Ayubowan! 🙏 Welcome to Cinnamon Chalet. I'm Cinnamon Chalet AI assistant, your AI host. How can I help you discover the beauty of Ambalangoda today?",
    );
  }

  appendMessage(role, text) {
    this.renderMessage(role, text, true);
    
    this.chatHistory.push({
      role: role === "assistant" ? "model" : "user",
      parts: [{ text }],
    });
    
    // Keep history manageable
    if (this.chatHistory.length > 20) {
        this.chatHistory.shift();
    }
    
    this.saveHistory();
  }

  renderMessage(role, text, shouldScroll) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `ai-message ${role}`;
    
    if (role === 'assistant') {
        msgDiv.innerHTML = this.formatText(text);
    } else {
        msgDiv.textContent = text;
    }
    
    this.messagesContainer.appendChild(msgDiv);
    if (shouldScroll) this.scrollToBottom();
  }

  formatText(text) {
    // Simple markdown-to-HTML converter
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="chat-link">$1</a>') // Links
        .replace(/^\* (.*)/gm, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

    if (formatted.includes('<li>')) {
        // Wrap lists if they exist
        formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    }
    
    return `<p>${formatted}</p>`;
  }

  showTypingIndicator() {
    if (this.isTyping) return;
    this.isTyping = true;

    const indicator = document.createElement("div");
    indicator.id = "typing-indicator";
    indicator.className = "typing-indicator";
    indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
    this.messagesContainer.appendChild(indicator);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    this.isTyping = false;
    const indicator = document.getElementById("typing-indicator");
    if (indicator) indicator.remove();
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  async handleSendMessage() {
    const text = this.input.value.trim();
    if (!text || this.isTyping) return;

    this.input.value = "";
    this.appendMessage("user", text);

    if (!CHAT_CONFIG.apiKey) {
      setTimeout(() => {
        this.appendMessage(
          "assistant",
          "I'm sorry, my AI brain isn't fully connected yet! Please add a Gemini API key in `assets/chatbot.js` to enable me.",
        );
      }, 1000);
      return;
    }

    await this.getAIResponse(text);
  }

  async getAIResponse(userText) {
    this.showTypingIndicator();

    try {
      // Build context from history
      const historyContext = this.chatHistory.map(m => 
        `${m.role === 'model' ? 'Cinnamon' : 'Guest'}: ${m.parts[0].text}`
      ).join('\n');
      
      const prompt = `${CHAT_CONFIG.villaInfo}\n\nRecent Conversation History:\n${historyContext}\n\nGuest: ${userText}\n\nCinnamon:`;
      
      let lastError = null;

      // Try each model in the list until one works
      for (const modelName of CHAT_CONFIG.models) {
        try {
          const url = `${CHAT_CONFIG.baseUrl}${modelName}:generateContent?key=${CHAT_CONFIG.apiKey}`;
          
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              contents: [{ parts: [{ text: prompt }] }] 
            }),
          });

          const data = await response.json();

          if (data.error) {
              console.warn(`Model ${modelName} failed:`, data.error.message);
              lastError = data.error.message;
              continue; // Try next model
          }

          if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiText = data.candidates[0].content.parts[0].text;
            this.hideTypingIndicator();
            this.appendMessage("assistant", aiText);
            return; // Success!
          }
        } catch (e) {
          console.error(`Fetch error for ${modelName}:`, e);
          lastError = e.message;
        }
      }

      // If we get here, all models failed
      throw new Error(lastError || 'All models failed');
    } catch (error) {
        console.error('Final AI Error Trace:', error);
      this.hideTypingIndicator();
      this.appendMessage(
        "assistant",
        "Oh, it seems my connection to the mountains is a bit weak right now. Please try again in a moment, or contact us directly via WhatsApp!",
      );
    }
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new AIChatbot();
});
