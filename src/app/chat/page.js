import Chat from './Chat';

export default function ChatPage() {
  return (
    <main className="flex flex-col h-[calc(100dvh-4rem)] md:h-screen bg-navy p-4 sm:p-8">
      <Chat />
    </main>
  );
}
