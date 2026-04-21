import { useState, useCallback } from 'react';
import { fetchConversations, fetchConversationDetail } from '../api/conversationApi';

// <채팅> 대화 목록 조회 및 특정 대화 불러오기를 담당하는 훅
// Sidebar의 API 통신 로직을 분리해 components/가 UI만 담당하도록 함
export function useConversations(onConversationLoad) {
  const [conversations, setConversations] = useState([]); // 서버에서 받아온 대화 목록

  // <채팅> 대화 목록을 서버에서 불러와 state에 저장
  const loadConversations = useCallback(() => {
    fetchConversations()
      .then(setConversations)
      .catch(() => console.error('대화 목록 로드 실패'));
  }, []);

  // <채팅> 특정 대화 클릭 시 전체 메시지를 불러와 콜백(onConversationLoad)으로 전달
  // onConversationLoad: MainPage의 loadConversation (messages[] 교체)
  const selectConversation = useCallback(async (id) => {
    try {
      const data = await fetchConversationDetail(id);
      onConversationLoad(data.conversationId, data.messages);
    } catch {
      console.error('대화 불러오기 실패');
    }
  }, [onConversationLoad]);

  return { conversations, loadConversations, selectConversation };
}
