import api from '../../../api/axiosInstance';
import { MOCK } from '../../../mock/MOCK';
import { USE_MOCKS } from '../../../mock/useMock';

// AI 응답은 LLM 처리 시간이 필요하므로 채팅 전용 타임아웃 설정
const CHAT_TIMEOUT = 60000; // 60초

// 1. 새 채팅 생성
// 로그인한 사용자는 백엔드에 채팅이 저장되고 chatId가 발급됨
// [codex] 비로그인 사용자는 목록용 chatId 없이, 서버 임시 채팅에만 대화 문맥을 저장한다.
export const createChat = async () => {
  if (USE_MOCKS) return MOCK.chat.detail.chatId;

  const response = await api.post('/api/chat');
  console.log('[chatApi] createChat 응답:', response.data);
  return response.data.chatId; // 새로 생성된 채팅 ID 반환
};

// [codex] 임시 게스트 채팅을 생성하고, 기존 게스트 채팅은 서버에서 폐기한다.
export const createGuestChat = async () => {
  if (USE_MOCKS) return { chatId: 'mock-guest-chat' };

  const response = await api.post('/api/chat/guest', null, { withCredentials: true });
  return response.data;
};

// [codex] 게스트는 현재 입력만 전송하며, 히스토리와 슬롯은 서버 임시 채팅에 최대 1시간 유지된다.
export const sendGuestChatMessage = async (content) => {
  if (USE_MOCKS) return MOCK.chat.message;

  console.log('[chatApi] sendGuestChatMessage 요청:', content);
  const response = await api.post('/api/chat/guest/sendMessage', { content }, { timeout: CHAT_TIMEOUT, withCredentials: true });
  console.log('[chatApi] sendGuestChatMessage 응답:', response.data);
  return response.data; // { messageId, intent, answer, recommendations, flags }
};

export const deleteGuestChat = async () => {
  if (USE_MOCKS) return;

  // [codex] 새 채팅을 선택하면 화면에서 사라지는 기존 임시 대화도 즉시 삭제한다.
  await api.delete('/api/chat/guest', { withCredentials: true });
};

// 4. 단건 메시지 전송 및 AI 응답 수신 (로그인용)
// 백엔드가 메시지 저장 → title 업데이트 → AI 호출을 한 번에 처리하고 응답 반환
export const sendChatMessage = async (chatId, content) => {
  if (USE_MOCKS) return MOCK.chat.message;

  console.log('[chatApi] sendChatMessage 요청 - chatId:', chatId, '/ content:', content);
  const response = await api.post(`/api/chat/${chatId}/sendMessage`, { content }, { timeout: CHAT_TIMEOUT });
  console.log('[chatApi] sendChatMessage 응답:', response.data);
  return response.data; // { messageId, intent, answer, recommendations, flags }
};

// 5. 사이드바용 채팅 목록 조회
// [codex] 백엔드 Chat 목록의 chatId를 별도 이름으로 변환하지 않고 그대로 사용한다.
export const fetchChats = async () => {
  if (USE_MOCKS) return MOCK.chat.chats;

  const response = await api.get('/api/chat');
  console.log('[chatApi] fetchChats 응답:', response.data);
  return response.data; // [{ chatId, title, createdAt }, ...]
};

// 6. 특정 채팅의 전체 메시지 조회
// 사이드바에서 이전 채팅을 클릭했을 때 해당 채팅의 메시지를 불러옴
export const fetchChatDetail = async (chatId) => {
  if (USE_MOCKS) {
    return {
      ...MOCK.chat.detail,
      chatId,
    };
  }

  console.log('[chatApi] fetchChatDetail 요청 - chatId:', chatId);
  const response = await api.get(`/api/chat/${chatId}`);
  console.log('[chatApi] fetchChatDetail 응답:', response.data);
  return response.data; // { chatId, title, messages: [{ role, content }, ...] }
};

// 7. 채팅 삭제
// 사이드바에서 X 버튼 클릭했을 때 해당 채팅을 DB에서 제거
export const deleteChat = async (chatId) => {
  if (USE_MOCKS) return;

  console.log('[chatApi] deleteChat 요청 - chatId:', chatId);
  await api.delete(`/api/chat/${chatId}`);
  console.log('[chatApi] deleteChat 완료 - chatId:', chatId);
};
