import { useState, useCallback } from 'react';
import { fetchConversations, fetchConversationDetail } from '../api/conversationApi';

// <채팅> 대화 목록 조회 및 특정 대화 불러오기를 담당하는 훅
// 기존에는 Sidebar 내부에서 호출했으나, MainPage로 이관하여
// useChat의 onNewConversation 콜백과 연결 → 새 대화 생성 시 목록 즉시 갱신 가능
export function useConversations() {
  const [conversations, setConversations] = useState([]);

  // <채팅> 대화 목록을 서버에서 불러와 state에 저장
  const loadConversations = useCallback(() => {
    fetchConversations()
      .then(setConversations)
      .catch(() => console.error('대화 목록 로드 실패'));
  }, []);

  // <채팅> 특정 대화 클릭 시 전체 메시지를 불러와 onConversationLoad 콜백으로 전달
  // onConversationLoad: MainPage의 loadConversation (messages[] 교체)
  // 기존에는 훅 생성 시 콜백을 고정했으나, 호출 시점에 전달받도록 변경 → 훅 재사용성 향상
  const selectConversation = useCallback(async (id, onConversationLoad) => {
    try {
      const data = await fetchConversationDetail(id);
      onConversationLoad(data.conversationId, data.messages);
    } catch {
      console.error('대화 불러오기 실패');
    }
  }, []);

  // 대화 삭제: 로컬 state에서만 제거 (백엔드 연동은 추후 추가)
  const deleteConversation = useCallback((id) => {
    setConversations(prev => prev.filter(conv => conv.conversationId !== id));
  }, []);

  return { conversations, loadConversations, selectConversation, deleteConversation };
}
