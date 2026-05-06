import api from '../../../api/axiosInstance';

// AI 응답은 LLM 처리 시간이 필요하므로 채팅 전용 타임아웃 설정
const CHAT_TIMEOUT = 60000; // 60초

// 1. 새 채팅 스레드 생성
// 로그인한 사용자는 백엔드에 스레드가 저장되고 chatId가 발급됨
// 비로그인 사용자는 chatId가 null로 유지되고 대화 내용도 저장되지 않음
export const createChatThread = async () => {
  const response = await api.post('/api/chat');
  console.log('createChatThread response:', response.data);
  return response.data.chatId; // 새로 생성된 스레드 ID 반환
};

// 2. 단건 메시지 전송 및 AI 응답 수신 (비로그인용)
// 대화 히스토리 전체를 매 요청마다 전송 → 백엔드는 stateless, DB 저장 없음
// messages: [{ role: 'user'|'assistant', content: string }, ...]
export const sendGuestChatMessage = async (messages) => {
  const response = await api.post('/api/chat/guest/sendMessage', { messages }, { timeout: CHAT_TIMEOUT });
  return response.data.reply;
};

// 3. 단건 메시지 전송 및 AI 응답 수신 (로그인용)
// 백엔드가 메시지 저장 → title 업데이트 → AI 호출을 한 번에 처리하고 응답 반환
export const sendChatMessage = async (chatThreadId, content) => {
  const response = await api.post(`/api/chat/${chatThreadId}/sendMessage`, { content }, { timeout: CHAT_TIMEOUT });
  return response.data.reply;
};

// 4. 사이드바용 채팅 스레드 목록 조회
// 로그인 사용자의 스레드 목록을 최신순으로 반환
export const fetchChatThreads = async () => {
  const response = await api.get('/api/chat');
  console.log('채팅 스레드 목록 응답:', response.data);  // 디버깅 로그
  return response.data; // [{ chatId, title, createdAt }, ...]
};

// 5. 특정 스레드의 전체 메시지 조회
// 사이드바에서 이전 스레드를 클릭했을 때 해당 스레드의 메시지를 불러옴
export const fetchChatThreadDetail = async (chatThreadId) => {
  const response = await api.get(`/api/chat/${chatThreadId}`);
  return response.data; // { chatId, title, messages: [{ role, content }, ...] }
};

// 6. 채팅 스레드 삭제
// 사이드바에서 X 버튼 클릭했을 때 해당 스레드를 DB에서 제거
export const deleteChatThread = async (chatThreadId) => {
  await api.delete(`/api/chat/${chatThreadId}`);
};
