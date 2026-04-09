import { ChatWindow } from '../components/chat/ChatWindow';

export default function ChatPage() {
  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: 'var(--vzir-bg)' }}
    >
      <ChatWindow />
    </div>
  );
}
