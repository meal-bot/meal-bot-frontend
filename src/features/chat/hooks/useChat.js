import { useState, useRef, useCallback, useEffect } from 'react';
import { createChat, createGuestChat, sendChatMessage, sendGuestChatMessage, deleteGuestChat,
         fetchChats, fetchChatDetail, deleteChat as deleteChatApi } from '../api/chatApi';
import { isLoggedIn } from '../../auth/utils/auth';

// 채팅 상태 전체를 관리하는 커스텀 훅
// - 현재 채팅: 메시지 목록, 채팅 ID, 전송/초기화/불러오기
// - 채팅 목록: 사이드바용 목록 조회/삭제
export function useChat() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // [codex] null이면 채팅 미생성 상태이며, 백엔드 Chat 식별자인 chatId를 그대로 보관한다.
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);
  // [codex] 게스트 채팅은 현재 화면에서만 재사용하며 새로고침 후에는 새 채팅을 만든다.
  const [guestChatReady, setGuestChatReady] = useState(false);
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const guestChatDeletionRef = useRef(null);

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

  // ── 채팅 목록 ──────────────────────────────────────────────

  // [codex] 채팅 목록은 API의 Chat 구조를 변환하지 않고 그대로 최신 상태로 갱신한다.
  const refreshChats = useCallback(() => {
    fetchChats()
      .then(setChats)
      .catch(() => console.error('채팅 목록 로드 실패'));
  }, []);

  // 채팅 삭제: 백엔드 DB에서 먼저 삭제 후 로컬 state에서도 제거
  const deleteChat = useCallback(async (chatIdToDelete) => {
    try {
      await deleteChatApi(chatIdToDelete);
      setChats(prev => prev.filter(chat => chat.chatId !== chatIdToDelete));
    } catch {
      console.error('채팅 삭제 실패');
    }
  }, []);

  // ── 현재 채팅 ──────────────────────────────────────────────

  // 메시지 전송 핸들러
  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;
    if (!query.trim() || isLoading) return;

    isSubmittingRef.current = true;

    const currentQuery = query;
    const userMsgId = Date.now();
    const assistantMsgId = userMsgId + 1;
    const loggedIn = isLoggedIn();

    // 로그인 상태이고 채팅이 없으면 → 첫 메시지 전송 전에 채팅 먼저 생성
    // [codex] 게스트는 목록용 chatId 없이 서버의 일회성 임시 채팅으로 진행한다.
    let currentChatId = chatId;
    if (loggedIn && !currentChatId) {
      try {
        currentChatId = await createChat();
        setChatId(currentChatId);
      } catch {
        console.error('채팅 생성 실패');
      }
    }
    if (!loggedIn && !guestChatReady) {
      try {
        // [codex] 직전 게스트 채팅 삭제가 끝난 뒤 새 채팅을 생성해 쿠키 응답 경합을 막는다.
        await guestChatDeletionRef.current;
        // [codex] 첫 메시지 직전에 채팅을 생성해 메시지를 보내지 않은 방문은 저장하지 않는다.
        await createGuestChat();
        setGuestChatReady(true);
      } catch {
        isSubmittingRef.current = false;
        console.error('게스트 임시 채팅 생성 실패');
        return;
      }
    }

    // 서버 응답을 기다리지 않고 화면에 즉시 표시
    // 사용자 메시지 + 빈 AI 말풍선(로딩 점 3개)을 동시에 추가
    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', content: currentQuery },
      { id: assistantMsgId, role: 'assistant', content: '', isTyping: false, recommendations: [], flags: null },
    ]);
    setQuery('');
    setIsLoading(true);

    try {
      let result;
      if (loggedIn) {
        result = await sendChatMessage(currentChatId, currentQuery);
      } else {
        // [codex] 문맥은 서버에서 유지하므로 프론트는 전체 대화 내역을 재전송하지 않는다.
        result = await sendGuestChatMessage(currentQuery);
      }
      const fullReply = result?.answer || '응답을 받지 못했습니다.';
      const recommendations = result?.recommendations || [];
      const flags = result?.flags ?? null;
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMsgId ? { ...msg, recommendations, flags } : msg
      ));
      setIsLoading(false);
      typeMessage(fullReply, assistantMsgId);
      // AI 응답 완료 후 갱신 → 백엔드가 타이틀을 생성한 뒤이므로 올바른 제목이 반영됨
      if (loggedIn) refreshChats();
    } catch (error) {
      console.error('채팅 에러:', error);
      console.error('에러 응답:', error?.response?.data);
      // [codex] 쿠키 만료와 서버 채팅 만료를 동일한 일회성 채팅 종료 화면으로 처리한다.
      const guestChatExpired = !loggedIn && [401, 410].includes(error?.response?.status);
      if (guestChatExpired) setGuestChatReady(false);
      const fallback = guestChatExpired
        ? '임시 대화가 만료되었습니다. 새 채팅을 시작해 주세요.'
        : '임시 답변입니다. (서버 연결 대기 중)';
      setIsLoading(false);
      typeMessage(fallback, assistantMsgId);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // 새 채팅 시작: 모든 상태 초기화
  const startNewChat = useCallback(() => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    if (!isLoggedIn() && guestChatReady) {
      // [codex] 게스트 화면을 초기화할 때 서버의 임시 대화도 함께 폐기한다.
      setGuestChatReady(false);
      const deletion = deleteGuestChat()
        .catch(() => console.error('게스트 임시 채팅 삭제 실패'))
        .finally(() => {
          if (guestChatDeletionRef.current === deletion) guestChatDeletionRef.current = null;
        });
      guestChatDeletionRef.current = deletion;
    }
    setMessages([]);
    setChatId(null);
    setQuery('');
    setIsLoading(false);
  }, [guestChatReady]);

  // 기존 채팅 불러오기: 사이드바 또는 캘린더 항목 클릭 시 호출
  const openExistingChat = useCallback(async (chatIdToOpen) => {
    try {
      const data = await fetchChatDetail(chatIdToOpen);
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      // [codex] 백엔드가 반환한 chatId를 현재 표시 중인 채팅 ID로 그대로 사용한다.
      setChatId(data.chatId);
      // 백엔드 메시지 { role, content }에 React key·타이핑 애니메이션용 id 추가
      setMessages(data.messages.map((msg, i) => ({ ...msg, id: i })));
      setQuery('');
      setIsLoading(false);
    } catch {
      console.error('채팅 불러오기 실패');
    }
  }, []);

  return {
    // 메시지 입력
    query, setQuery,
    // 현재 채팅
    messages, isLoading, hasMessages, messagesEndRef, chatId,
    handleSubmit, startNewChat, openExistingChat,
    // 채팅 목록
    chats, refreshChats, deleteChat,
  };
}
