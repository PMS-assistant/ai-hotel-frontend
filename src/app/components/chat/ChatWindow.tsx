import { useEffect, useRef } from 'react';
import { useChatStore } from '../../stores/useChatStore';
import { useUserStore } from '../../stores/useUserStore';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { QuickPrompts } from './QuickPrompts';
import { ChatInput } from './ChatInput';

export function ChatWindow() {
  const { conversations, activeConversationId, isTyping, sendMessage } = useChatStore();
  const { hotelId } = useUserStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const hasMessages = (activeConversation?.messages?.length ?? 0) > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isTyping]);

  const handleSend = async (content: string) => {
    await sendMessage(content, hotelId);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-4 min-h-0">
        {!hasMessages ? (
          <QuickPrompts onSelect={handleSend} />
        ) : (
          <>
            {activeConversation!.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
}
