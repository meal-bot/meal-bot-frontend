import api from './axiosInstance';

// 사용자가 입력한 메시지를 서버로 보내는 함수
export const sendChatQuery = async (message) => {
    try {
        const response = await api.post('/api/chat',
            {
                content: message // JSON 객체로 포장 Request Body
            }
        );
        return response.data; // 서버에서 온 답변 리턴 Response Body
        //return { reply: `(테스트) '${message}'에 대한 AI 답변입니다.` };  // 테스트용 임시 답변
    } catch (error) {
        console.error("통신 에러:", error);
        throw error;
    }
};