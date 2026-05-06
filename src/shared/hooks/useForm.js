// 입력 form 상태 관리 커스텀 훅
// 폼 입력값 관리하는 코드인데, 로그인/회원가입/프로필 수정 세 페이지 모두 "입력창 값 바뀌면 state에 저장" 하는 동일한 구조
// 그래서 useForm이라는 커스텀 훅으로 빼서 재사용

import { useState } from 'react';

export function useForm(initialValues) {
  const [form, setForm] = useState(initialValues);
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return { form, setForm, handleChange };
}
