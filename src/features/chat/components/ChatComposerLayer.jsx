import { FloatingActionButton } from '../../../shared/components/ui';
import ChatInput from './ChatInput';

export default function ChatComposerLayer({
  sidebarOpen,
  showScrollButton,
  onScrollToBottom,
  inputProps,
}) {
  return (
    <section className="chat-composer-enter fixed bottom-6 md:bottom-10 right-0 left-0 z-50 pointer-events-none">
      <div className={`max-w-screen-2xl mx-auto px-4 md:pr-12 transition-all duration-300 ${sidebarOpen ? 'md:pl-64' : 'md:pl-16'}`}>
        <div className="flex flex-col items-center">
          {showScrollButton && (
            <FloatingActionButton
              icon="keyboard_arrow_down"
              label="최신 메시지"
              onClick={onScrollToBottom}
              className="mb-3"
            />
          )}
          <ChatInput {...inputProps} />
        </div>
      </div>
    </section>
  );
}
