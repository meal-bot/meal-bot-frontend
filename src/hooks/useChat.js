import { useState, useRef, useCallback, useEffect } from 'react';
import { createConversation, sendChat, sendGuestChat } from '../api/conversationApi';
import { isLoggedIn } from '../utils/auth';

// <채팅> 채팅 상태 전체를 관리하는 커스텀 훅
// 메시지 목록, 대화 ID, 로딩 상태, 전송/초기화/불러오기 기능을 제공
// onNewConversation: 새 대화가 생성될 때 MainPage에서 전달받는 콜백 (대화 목록 즉시 갱신용)
export function useChat({ onNewConversation } = {}) {
  const [query, setQuery] = useState('');          // 입력창 텍스트
  const [messages, setMessages] = useState([]);    // 화면에 표시되는 메시지 목록
  const [isLoading, setIsLoading] = useState(false);
  // <채팅> conversationId: 로그인 시 백엔드 대화와 연결되는 ID
  // null이면 대화 미생성 상태 (비로그인이거나 새 채팅 시작 전)
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);       // 자동 스크롤용 DOM 참조
  const typingIntervalRef = useRef(null);    // 타이핑 애니메이션 인터벌 참조

  // 메시지가 하나라도 있으면 true (헤더/슬라이더 숨김 여부 결정)
  const hasMessages = messages.length > 0;

  // 언마운트 시 진행 중인 타이핑 인터벌 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // <채팅> 타이핑 애니메이션: AI 응답을 40ms 간격으로 한 글자씩 출력
  // fullText: 완성된 전체 응답, messageId: 업데이트할 메시지 ID
  const typeMessage = useCallback((fullText, messageId) => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    let index = 0;
    typingIntervalRef.current = setInterval(() => {
      index++;
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, content: fullText.slice(0, index), isTyping: index < fullText.length }
            : msg
        )
      );
      if (index >= fullText.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    }, 40);
  }, []);

  // <채팅> 메시지 전송 핸들러
  const handleSubmit = async () => {
    if (!query.trim() || isLoading) return;

    const currentQuery = query;
    const userMsgId = Date.now();
    const assistantMsgId = userMsgId + 1;
    const loggedIn = isLoggedIn();

    // <채팅> 로그인 상태이고 대화가 없으면 → 첫 메시지 전송 전에 대화 먼저 생성
    // 비로그인은 대화 ID 없이 진행 (메모리에만 저장)
    let currentConversationId = conversationId;
    if (loggedIn && !currentConversationId) {
      try {
        currentConversationId = await createConversation();
        setConversationId(currentConversationId);
      } catch {
        console.error('대화 생성 실패');
      }
    }

    // <채팅> 서버 응답을 기다리지 않고 화면에 즉시 표시
    // 사용자 메시지 + 빈 AI 말풍선(로딩 점 3개)을 동시에 추가
    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', content: currentQuery },
      { id: assistantMsgId, role: 'assistant', content: '', isTyping: false },
    ]);
    setQuery('');
    setIsLoading(true);

    try {
      let result;
      if (loggedIn) {
        result = await sendChat(currentConversationId, currentQuery);
      } else {
        // <채팅 - 비로그인> 백엔드가 stateless이므로 컨텍스트를 매 요청마다 직접 전달
        // setMessages 호출 전의 messages를 사용 → 빈 assistant placeholder가 섞이지 않은 깨끗한 히스토리
        // 현재 입력(currentQuery)을 마지막에 추가해 전체 대화 흐름을 구성
        const guestChatHistory = [
          ...messages.map(({ role, content }) => ({ role, content })),
          { role: 'user', content: currentQuery },
        ];
        result = await sendGuestChat(guestChatHistory);
      }
      const fullReply = result.reply || '응답을 받지 못했습니다.';
      setIsLoading(false);
      typeMessage(fullReply, assistantMsgId);
      // AI 응답 완료 후 갱신 → 백엔드가 타이틀을 생성한 뒤이므로 올바른 제목이 반영됨
      onNewConversation?.();
    } catch {
      const fallback = '임시 답변입니다. (서버 연결 대기 중)';
      setIsLoading(false);
      typeMessage(fallback, assistantMsgId);
    }
  };

  // <채팅> 새 채팅 시작: 모든 상태 초기화
  // 브라우저 재접속 시에는 useState 초기값으로 자동 초기화되므로 별도 처리 불필요
  const startNewChat = useCallback(() => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    setMessages([]);
    setConversationId(null);
    setQuery('');
    setIsLoading(false);
  }, []);

  // <채팅> 이전 대화 불러오기: 사이드바 항목 클릭 시 호출
  // 백엔드 메시지 형식 { role, content }에 화면 렌더링용 id를 붙여 messages에 세팅
  const loadConversation = useCallback((id, conversationMessages) => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    setConversationId(id);
    setMessages(conversationMessages.map((msg, i) => ({ ...msg, id: i })));
    setQuery('');
    setIsLoading(false);
  }, []);

  return {
    query, setQuery,
    messages, isLoading, hasMessages,
    messagesEndRef, handleSubmit,
    startNewChat, loadConversation,
  };
}
