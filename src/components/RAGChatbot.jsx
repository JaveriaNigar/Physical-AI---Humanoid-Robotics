import React, { useState, useEffect, useRef } from 'react';
import styles from './RAGChatbot.module.css';
import getChatbotConfig from '../config/chatbotConfig';

export default function RAGChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: 'Hi! I\'m your AI tutor for the Physical AI & Humanoid Robotics book. You can:\n\n1. **Ask questions** about the book content\n2. **Select any text** from the book and click the "Ask AI" button\n3. **Get instant answers** based on the book\'s content\n\nHow can I help you today?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with default and update from config
  const [apiEndpoint, setApiEndpoint] = useState(() => {
    const config = getChatbotConfig();
    return config.apiEndpoint || 'http://localhost:3000';
  });

  const messagesEndRef = useRef(null);
  const chatboxRef = useRef(null);

  // Detect selected text
  useEffect(() => {
    const handleSelection = () => {
      const selected = window.getSelection().toString().trim();
      if (selected) {
        setSelectedText(selected);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show notification when text is selected
  useEffect(() => {
    if (selectedText) {
      const timer = setTimeout(() => {
        console.log('Selected text detected:', selectedText.substring(0, 50));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedText]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      selectedText: selectedText || null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const endpoint = selectedText
        ? `${apiEndpoint}/ask-selected-text`
        : `${apiEndpoint}/ask`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputValue,
          selected_text: selectedText || null,
          top_k: 5,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Add assistant response
      const assistantMessage = {
        id: messages.length + 2,
        type: 'assistant',
        text: data.answer,
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSelectedText(''); // Clear selected text after use
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        type: 'assistant',
        text: `Error: ${error.message}. Make sure the API server is running at ${apiEndpoint}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAskAboutSelected = () => {
    if (!selectedText) {
      alert('Please select text from the book first');
      return;
    }
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Floating action button */}
      <div className={styles.buttonContainer}>
        <button
          className={styles.floatingButton}
          onClick={() => setIsOpen(!isOpen)}
          title="Open AI Tutor"
          aria-label="Open AI Tutor"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="1" />
            <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
          </svg>
        </button>

        {/* Ask about selected text button (shows when text is selected) */}
        {selectedText && (
          <button
            className={styles.selectedTextButton}
            onClick={handleAskAboutSelected}
            title={`Ask AI about: "${selectedText.substring(0, 30)}..."`}
          >
            Ask AI
          </button>
        )}
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className={styles.chatWindow} ref={chatboxRef}>
          {/* Header */}
          <div className={styles.header}>
            <h3>AI Tutor</h3>
            <p>Physical AI & Robotics Assistant</p>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages container */}
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${styles[message.type]}`}
              >
                <div className={styles.messageContent}>
                  <div className={styles.messageText}>{message.text}</div>
                  {message.selectedText && (
                    <div className={styles.selectedTextContext}>
                      <strong>Selected text:</strong>
                      <p>"{message.selectedText.substring(0, 100)}..."</p>
                    </div>
                  )}
                  {message.sources && message.sources.length > 0 && (
                    <div className={styles.sources}>
                      <strong>Sources:</strong>
                      {message.sources.map((source, idx) => (
                        <div key={idx} className={styles.source}>
                          {source.url !== 'selected_text' && (
                            <a href={source.url} target="_blank" rel="noopener noreferrer">
                              {new URL(source.url).pathname.split('/').pop() || 'View'}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.messageContent}>
                  <div className={styles.loadingSpinner}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className={styles.inputArea}>
            {selectedText && (
              <div className={styles.selectedTextIndicator}>
                Selected: "{selectedText.substring(0, 40)}
                {selectedText.length > 40 ? '...' : ''}
                "
              </div>
            )}
            <div className={styles.inputContainer}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about the book..."
                className={styles.input}
                disabled={isLoading}
                rows="3"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className={styles.sendButton}
                aria-label="Send message"
              >
                {isLoading ? '...' : '→'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
