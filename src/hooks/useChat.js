import { useState, useRef, useCallback, useEffect } from 'react';
import { sendChatQuery } from '../api/chatService';

// 채팅 메시지 상태, 전송, 타이핑 애니메이션 관리 훅
export function useChat() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);       // 전체 메시지 목록
  const [isLoading, setIsLoading] = useState(false);  // AI 응답 대기 중 여부
  const messagesEndRef = useRef(null);                // 메시지 목록 맨 아래 DOM 참조 (자동 스크롤용)
  const typingIntervalRef = useRef(null);             // 타이핑 애니메이션 인터벌 참조

  // 메시지가 하나라도 있으면 true (헤더/슬라이더 숨김 여부 결정에 사용)
  const hasMessages = messages.length > 0;

  // 컴포넌트 언마운트 시 진행 중인 타이핑 인터벌 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 한 글자씩 출력하는 타이핑 애니메이션
  // fullText: 전체 응답 텍스트, messageId: 업데이트할 메시지 ID
  const typeMessage = useCallback((fullText, messageId) => {
    // 이전 타이핑 인터벌이 있으면 취소
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    let index = 0;
    // 40ms마다 글자 하나씩 추가
    typingIntervalRef.current = setInterval(() => {
      index++;
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            // 해당 메시지의 content를 index만큼 잘라서 업데이트, 타이핑 완료 여부도 함께 갱신
            ? { ...msg, content: fullText.slice(0, index), isTyping: index < fullText.length }
            : msg
        )
      );
      // 모든 글자를 다 출력하면 인터벌 종료
      if (index >= fullText.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    }, 40);
  }, []);

  // 채팅 전송 핸들러
  const handleSubmit = async () => {
    // 빈 입력이거나 이미 로딩 중이면 무시
    if (!query.trim() || isLoading) return;

    const currentQuery = query;
    const userMsgId = Date.now();         // 사용자 메시지 ID (현재 시간을 밀리초로 변환해서 고유한 ID 생성)
    const assistantMsgId = userMsgId + 1; // AI 메시지 ID (사용자 ID + 1로 고유성 보장)

    // 사용자 메시지와 빈 AI 메시지 자리를 미리 추가
    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', content: currentQuery },
      { id: assistantMsgId, role: 'assistant', content: '', isTyping: false },
    ]);
    setQuery('');       // 입력창 초기화
    setIsLoading(true); // 로딩 상태 시작 (점 3개 애니메이션 표시)

    try {
      const result = await sendChatQuery(currentQuery);
      const fullReply = result.reply || '전송 했습니다.';
      setIsLoading(false);
      typeMessage(fullReply, assistantMsgId); // 응답을 타이핑 애니메이션으로 출력
    } catch {
      // 서버 오류 시 fallback 메시지를 타이핑 애니메이션으로 출력
      const fallback = '임시 답변입니다. (서버 연결 대기 중)';
      setIsLoading(false);
      typeMessage(fallback, assistantMsgId);
    }
  };

  return { query, setQuery, messages, isLoading, hasMessages, messagesEndRef, handleSubmit };
}
