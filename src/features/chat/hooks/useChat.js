import { useState, useRef, useCallback, useEffect } from 'react';
import { createChatThread, sendChatMessage, sendGuestChatMessage,
         fetchChatThreads, fetchChatThreadDetail, deleteChatThread as deleteChatThreadApi } from '../api/chatApi';
import { isLoggedIn } from '../../auth/utils/auth';

const toChatThread = (chat) => ({
  chatThreadId: chat.chatId,
  title: chat.title,
  createdAt: chat.createdAt,
});

// 채팅 상태 전체를 관리하는 커스텀 훅
// - 활성 스레드: 메시지 목록, 스레드 ID, 전송/초기화/불러오기
// - 스레드 목록: 사이드바용 목록 조회/삭제
export function useChat() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // null이면 스레드 미생성 상태 (비로그인이거나 새 채팅 시작 전)
  const [chatThreadId, setChatThreadId] = useState(null);
  const [chatThreads, setChatThreads] = useState([]);
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);

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

  // 타이핑 애니메이션: AI 응답을 40ms 간격으로 한 글자씩 출력
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

  // ── 스레드 목록 ────────────────────────────────────────────

  // 스레드 목록을 서버에서 불러와 state에 저장
  const fetchThreadList = useCallback(() => {
    fetchChatThreads()
      .then((serverChatList) => setChatThreads(serverChatList.map(toChatThread)))
      .catch(() => console.error('채팅 스레드 목록 로드 실패'));
  }, []);

  // 스레드 삭제: 백엔드 DB에서 먼저 삭제 후 로컬 state에서도 제거
  const deleteChatThread = useCallback(async (chatThreadId) => {
    try {
      await deleteChatThreadApi(chatThreadId);
      setChatThreads(prev => prev.filter(thread => thread.chatThreadId !== chatThreadId));
    } catch {
      console.error('채팅 스레드 삭제 실패');
    }
  }, []);

  // ── 활성 스레드 ────────────────────────────────────────────

  // 메시지 전송 핸들러
  const handleSubmit = async () => {
    if (!query.trim() || isLoading) return;

    const currentQuery = query;
    const userMsgId = Date.now();
    const assistantMsgId = userMsgId + 1;
    const loggedIn = isLoggedIn();

    // 로그인 상태이고 스레드가 없으면 → 첫 메시지 전송 전에 스레드 먼저 생성
    // 비로그인은 스레드 ID 없이 진행 (메모리에만 저장)
    let currentChatThreadId = chatThreadId;
    if (loggedIn && !currentChatThreadId) {
      try {
        currentChatThreadId = await createChatThread();
        setChatThreadId(currentChatThreadId);
      } catch {
        console.error('채팅 스레드 생성 실패');
      }
    }

    // 서버 응답을 기다리지 않고 화면에 즉시 표시
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
        result = await sendChatMessage(currentChatThreadId, currentQuery);
      } else {
        // 비로그인: 백엔드가 stateless이므로 컨텍스트를 매 요청마다 직접 전달
        // setMessages 호출 전의 messages를 사용 → 빈 assistant placeholder가 섞이지 않은 깨끗한 히스토리
        const guestChatHistory = [
          ...messages.map(({ role, content }) => ({ role, content })),
          { role: 'user', content: currentQuery },
        ];
        result = await sendGuestChatMessage(guestChatHistory);
      }
      const fullReply = result || '응답을 받지 못했습니다.';
      setIsLoading(false);
      typeMessage(fullReply, assistantMsgId);
      // AI 응답 완료 후 갱신 → 백엔드가 타이틀을 생성한 뒤이므로 올바른 제목이 반영됨
      fetchThreadList();
    } catch (error) {
      console.error('채팅 에러:', error);
      console.error('에러 응답:', error?.response?.data);
      const fallback = '임시 답변입니다. (서버 연결 대기 중)';
      setIsLoading(false);
      typeMessage(fallback, assistantMsgId);
    }
  };

  // 새 채팅 스레드 시작: 모든 상태 초기화
  const startChatThread = useCallback(() => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    setMessages([]);
    setChatThreadId(null);
    setQuery('');
    setIsLoading(false);
  }, []);

  // 이전 스레드 불러오기: 사이드바 항목 클릭 시 호출
  const openChatThread = useCallback(async (chatThreadId) => {
    try {
      const data = await fetchChatThreadDetail(chatThreadId);
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      // 백엔드 chatId(DB 키) → 프론트 chatThreadId state로 매핑
      setChatThreadId(data.chatId);
      // 백엔드 메시지 { role, content }에 React key·타이핑 애니메이션용 id 추가
      setMessages(data.messages.map((msg, i) => ({ ...msg, id: i })));
      setQuery('');
      setIsLoading(false);
    } catch {
      console.error('채팅 스레드 불러오기 실패');
    }
  }, []);

  return {
    // 메시지 입력
    query, setQuery,
    // 활성 스레드
    messages, isLoading, hasMessages, messagesEndRef, chatThreadId,
    handleSubmit, startChatThread, openChatThread,
    // 스레드 목록
    chatThreads, fetchThreadList, deleteChatThread,
  };
}
