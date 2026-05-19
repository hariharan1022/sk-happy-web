import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Send, User, MessageSquare, ArrowLeft, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
  const { currentUser, chatMessages, sendMessage, users, shops } = useMarketplace();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [activeContactId, setActiveContactId] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    }
  }, [currentUser, navigate]);

  // Find all people this user has messages with
  const getContacts = () => {
    if (!currentUser) return [];

    const uniqueUserIds = new Set();
    chatMessages.forEach(msg => {
      if (msg.senderId === currentUser.id) {
        uniqueUserIds.add(msg.receiverId);
      } else if (msg.receiverId === currentUser.id) {
        uniqueUserIds.add(msg.senderId);
      }
    });

    // If buyer, ensure we can chat with all active shop sellers even if no messages yet
    if (currentUser.role === 'buyer') {
      shops.forEach(shop => {
        if (shop.status === 'approved') {
          uniqueUserIds.add(shop.sellerId);
        }
      });
    }

    return Array.from(uniqueUserIds).map(userId => {
      const contactInfo = users.find(u => u.id === userId);
      const contactShop = shops.find(s => s.sellerId === userId);
      
      return {
        id: userId,
        name: contactShop ? contactShop.name : (contactInfo?.name || 'Happy Maker'),
        avatar: contactInfo?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: contactInfo?.role || 'user',
        shopId: contactShop?.id || null
      };
    });
  };

  const contacts = getContacts();

  // Set first contact active by default if not set
  useEffect(() => {
    if (contacts.length > 0 && !activeContactId) {
      setActiveContactId(contacts[0].id);
    }
  }, [contacts, activeContactId]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, activeContactId]);

  if (!currentUser) return null;

  const activeContact = contacts.find(c => c.id === activeContactId);

  // Filter messages for current chat conversation
  const currentConversation = chatMessages.filter(msg => 
    (msg.senderId === currentUser.id && msg.receiverId === activeContactId) ||
    (msg.senderId === activeContactId && msg.receiverId === currentUser.id)
  );

  const handleSend = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeContactId) return;

    sendMessage(activeContactId, typedMessage);
    setTypedMessage('');
  };

  return (
    <div className="container chat-page-container">
      <div className="chat-layout card">
        
        {/* Sidebar */}
        <div className={`chat-sidebar ${activeContactId ? 'hidden-mobile' : ''}`}>
          <div className="sidebar-header">
            <h3><MessageSquare className="icon-pink" /> Happy Chats</h3>
            <p className="subtitle">Connect with {currentUser.role === 'buyer' ? 'Sellers' : 'Buyers'}</p>
          </div>
          
          <ul className="contacts-list">
            {contacts.length === 0 ? (
              <p className="no-contacts">No conversations yet. Find a shop to ask questions! 🌸</p>
            ) : (
              contacts.map(contact => {
                const isSelected = contact.id === activeContactId;
                const lastMsg = chatMessages.filter(msg => 
                  (msg.senderId === currentUser.id && msg.receiverId === contact.id) ||
                  (msg.senderId === contact.id && msg.receiverId === currentUser.id)
                ).slice(-1)[0];

                return (
                  <li 
                    key={contact.id} 
                    className={`contact-item ${isSelected ? 'active' : ''}`}
                    onClick={() => setActiveContactId(contact.id)}
                  >
                    <div className="contact-avatar-wrapper">
                      <img src={contact.avatar} alt={contact.name} className="contact-avatar" />
                      <span className={`status-dot online`} />
                    </div>
                    <div className="contact-details">
                      <div className="contact-meta">
                        <span className="contact-name">{contact.name}</span>
                        {contact.role === 'seller' && <span className="role-tag"><Store size={12} /> Seller</span>}
                      </div>
                      <p className="last-message">
                        {lastMsg ? lastMsg.text : 'Click to start chatting...'}
                      </p>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Chat Pane */}
        <div className={`chat-pane ${!activeContactId ? 'hidden-mobile' : ''}`}>
          {activeContact ? (
            <>
              {/* Header */}
              <div className="chat-header">
                <button className="back-btn" onClick={() => setActiveContactId(null)}>
                  <ArrowLeft size={20} />
                </button>
                <div className="active-contact-info">
                  <img src={activeContact.avatar} alt={activeContact.name} className="active-avatar" />
                  <div>
                    <h4>{activeContact.name}</h4>
                    <p className="active-status">Active now</p>
                  </div>
                </div>
                {activeContact.shopId && (
                  <button 
                    onClick={() => navigate(`/shop/${activeContact.shopId}`)} 
                    className="btn btn-outline visit-shop-btn"
                  >
                    Visit Shop
                  </button>
                )}
              </div>

              {/* Messages Screen */}
              <div className="messages-container">
                {currentConversation.length === 0 ? (
                  <div className="chat-welcome">
                    <MessageSquare size={48} className="welcome-icon" />
                    <h4>Say Hello to {activeContact.name}!</h4>
                    <p>Ask about custom sizes, colors, shipping, or stock. We are here to help!</p>
                  </div>
                ) : (
                  currentConversation.map(msg => {
                    const isMine = msg.senderId === currentUser.id;
                    const dateStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div key={msg.id} className={`message-row ${isMine ? 'mine' : 'theirs'}`}>
                        {!isMine && <img src={activeContact.avatar} alt="" className="msg-avatar" />}
                        <div className="message-bubble-wrapper">
                          <div className="message-bubble">
                            {msg.text}
                          </div>
                          <span className="message-time">{dateStr}</span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <form onSubmit={handleSend} className="chat-input-bar">
                <input 
                  type="text" 
                  placeholder="Type a cute message..." 
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  className="form-control chat-input"
                  required
                />
                <button type="submit" className="btn btn-primary send-btn" aria-label="Send message">
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <MessageSquare size={64} className="placeholder-icon" />
              <h3>Your Conversations</h3>
              <p>Select a shop or customer from the left sidebar to start chatting in real-time!</p>
            </div>
          )}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .chat-page-container {
          padding-top: 20px;
          padding-bottom: 40px;
          height: calc(100vh - 120px);
        }
        .chat-layout {
          display: flex;
          height: 100%;
          padding: 0;
          overflow: hidden;
          background: var(--bg-card);
          border-color: var(--border-color);
        }
        .chat-sidebar {
          width: 320px;
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
        }
        .sidebar-header h3 {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .icon-pink {
          color: var(--primary);
        }
        .subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .contacts-list {
          list-style: none;
          overflow-y: auto;
          flex: 1;
        }
        .contact-item {
          display: flex;
          gap: 12px;
          padding: 15px 20px;
          border-bottom: 1px solid rgba(255, 117, 143, 0.05);
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .contact-item:hover {
          background: rgba(255, 117, 143, 0.04);
        }
        .contact-item.active {
          background: var(--primary-light);
          border-left: 4px solid var(--primary);
        }
        .contact-avatar-wrapper {
          position: relative;
          width: 44px;
          height: 44px;
        }
        .contact-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }
        .status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid var(--bg-card);
        }
        .status-dot.online {
          background: #10B981;
        }
        .contact-details {
          flex: 1;
          min-width: 0;
        }
        .contact-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .contact-name {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .role-tag {
          font-size: 0.7rem;
          color: var(--secondary);
          display: flex;
          align-items: center;
          gap: 2px;
          font-weight: bold;
        }
        .last-message {
          font-size: 0.8rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .no-contacts {
          text-align: center;
          padding: 30px 20px;
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .chat-pane {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          background: rgba(255, 255, 255, 0.2);
        }
        .no-chat-selected {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          color: var(--text-muted);
          text-align: center;
          padding: 40px;
        }
        .placeholder-icon {
          color: var(--border-hover);
          margin-bottom: 16px;
          animation: bounce 3s infinite ease-in-out;
        }
        .chat-header {
          padding: 15px 20px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-card);
        }
        .back-btn {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-primary);
          margin-right: 12px;
        }
        .active-contact-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .active-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .active-contact-info h4 {
          font-size: 1rem;
        }
        .active-status {
          font-size: 0.75rem;
          color: #10B981;
          font-weight: 500;
        }
        .visit-shop-btn {
          padding: 6px 14px;
          font-size: 0.8rem;
        }
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .chat-welcome {
          text-align: center;
          max-width: 320px;
          margin: 40px auto;
          color: var(--text-secondary);
        }
        .welcome-icon {
          color: var(--primary);
          margin-bottom: 12px;
        }
        .message-row {
          display: flex;
          gap: 10px;
          max-width: 75%;
        }
        .message-row.mine {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .message-row.theirs {
          align-self: flex-start;
        }
        .msg-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
          align-self: flex-end;
        }
        .message-bubble-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .message-bubble {
          padding: 12px 16px;
          border-radius: var(--border-radius-md);
          font-size: 0.92rem;
          line-height: 1.4;
          box-shadow: var(--shadow-sm);
        }
        .mine .message-bubble {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .theirs .message-bubble {
          background: var(--bg-card);
          color: var(--text-primary);
          border-bottom-left-radius: 4px;
          border: 1px solid var(--border-color);
        }
        .message-time {
          font-size: 0.7rem;
          color: var(--text-muted);
          align-self: flex-end;
        }
        .mine .message-time {
          align-self: flex-end;
        }
        .theirs .message-time {
          align-self: flex-start;
        }
        .chat-input-bar {
          padding: 15px 20px;
          background: var(--bg-card);
          border-top: 1px solid var(--border-color);
          display: flex;
          gap: 10px;
        }
        .chat-input {
          flex: 1;
          border-radius: var(--border-radius-lg);
          margin-bottom: 0;
        }
        .send-btn {
          border-radius: 50%;
          width: 44px;
          height: 44px;
          padding: 0;
        }

        /* Responsive Mobile Chat overrides */
        @media (max-width: 768px) {
          .chat-page-container {
            height: calc(100vh - 100px);
            padding: 10px;
          }
          .chat-sidebar {
            width: 100%;
          }
          .chat-sidebar.hidden-mobile {
            display: none;
          }
          .chat-pane.hidden-mobile {
            display: none;
          }
          .back-btn {
            display: block;
          }
        }
      `}} />
    </div>
  );
}
