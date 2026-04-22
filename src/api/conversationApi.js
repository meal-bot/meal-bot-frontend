import api from './axiosInstance';

// <채팅> 새 대화 생성
// 첫 메시지를 보내기 전에 호출해서 conversationId를 확보함
// 백엔드가 title을 "새 대화"로 초기 생성하고, 첫 메시지 수신 시 실제 내용으로 업데이트
export const createConversation = async () => {
  const response = await api.post('/api/conversations');
  return response.data.conversationId;
};


// <채팅> 메시지 전송 및 AI 응답 수신 (비로그인용)
// 대화 히스토리 전체를 매 요청마다 전송 → 백엔드는 stateless, DB 저장 없음
// messages: [{ role: 'user'|'assistant', content: string }, ...]
export const sendChat_guest = async (messages) => {
  const response = await api.post('/api/conversations/guest/chat', { messages });
  return response.data; // { reply }
};

// <채팅> 메시지 전송 및 AI 응답 수신
// conversationId가 null이면 비로그인 상태 (백엔드에서 저장하지 않음)
// 백엔드가 메시지 저장 → title 업데이트 → AI 호출을 한 번에 처리하고 응답 반환
export const sendChat = async (conversationId, content) => {
  const response = await api.post(`/api/conversations/${conversationId}/chat`, { content });
  return response.data; // { messageId, reply }
};

// <채팅> 사이드바용 대화 목록 조회
// 로그인 사용자의 대화 목록을 최신순으로 반환
export const fetchConversations = async () => {
  const response = await api.get('/api/conversations');
  console.log('대화 목록 응답:', response.data);  // 디버깅 로그: 서버에서 어떤 데이터가 오는지 확인
  return response.data; // [{ conversationId, title, createdAt }, ...]
};

// <채팅> 특정 대화의 전체 메시지 조회
// 사이드바에서 이전 대화를 클릭했을 때 해당 대화 내용을 불러옴
export const fetchConversationDetail = async (conversationId) => {
  const response = await api.get(`/api/conversations/${conversationId}`);
  return response.data; // { conversationId, title, messages: [{ role, content }, ...] }
};

// <채팅> 특정 대화 내역 삭제
// 사이드바에서 x 버튼 클릭했을 때 해당 대화 내용을 DB에서 제거
export const deleteConversation = async (conversationId) => {
  const response = await api.post(`/api/conversations/${conversationId}/delete`);
  return response.data; // { success: true }
};