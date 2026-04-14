import axios from 'axios';

const instance = axios.create(
    {
        baseURL: 'http://localhost:8080', // 스프링 서버 주소
        timeout: 5000, // 5초 넘으면 자동 취소
        headers: { 'Content-Type': 'application/json' }
    }
);

export default instance;