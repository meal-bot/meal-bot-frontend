import RecommendationCards from './RecommendationCards';

export default function ChatThread({ messages, isLoading, messagesEndRef }) {
  if (messages.length === 0) return null;

  return (
    <section className="max-w-3xl mx-auto flex flex-col gap-10 pb-8 outline outline-1 outline-red-400">
      {messages.map(msg => {
        const recommendations = msg.recommendations || [];

        return (
          <div key={msg.id} className="flex flex-col gap-2">
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-primary-container" style={{ fontSize: '16px' }}>smart_toy</span>
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${msg.role === 'user'
                  ? 'bg-primary text-on-primary rounded-br-sm'
                  : 'bg-surface-container-low text-on-surface rounded-bl-sm border border-outline-variant/30'
                }`}
              >
                {msg.role === 'assistant' && isLoading && msg.content === '' ? (
                  <div className="flex items-center gap-1.5 py-1 px-1">
                    <span className="w-2 h-2 bg-on-surface-variant/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-on-surface-variant/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-on-surface-variant/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">
                    {msg.content}
                    {msg.isTyping && (
                      <span className="inline-block w-0.5 h-4 bg-current ml-0.5 align-middle animate-pulse" />
                    )}
                  </p>
                )}
              </div>
            </div>
            {recommendations.length > 0 && (
              <div className="ml-0 sm:ml-10">
                <RecommendationCards recommendations={recommendations} />
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </section>
  );
}
