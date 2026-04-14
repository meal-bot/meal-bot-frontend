import api from './axiosInstance';

// 사용자가 입력한 메시지를 서버로 보내는 함수
export const sendChatQuery = async (message) => {
    try {
        const response = await api.post('/api/chat',
            {
                content: message // JSON 객체로 포장
            }
        );
        return response.data; // 서버에서 온 답변 리턴
    } catch (error) {
        console.error("통신 에러:", error);
        throw error;
    }
};