import { useState, useRef } from 'react';
import Layout from '../../../shared/components/layout/Layout';
import { Button, Card, TextField } from '../../../shared/components/ui';
import { useForm } from '../../../shared/hooks/useForm';
import { isPasswordMinLength, doPasswordsMatch } from '../utils/validation';

function PasswordField({ label, name, value, onChange, show, onToggle, error, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
        {label}
      </label>
      <div
        className={`flex items-center gap-3 bg-surface-container rounded-xl px-4 py-3.5 border transition-colors ${error
          ? 'border-red-300 focus-within:border-red-400'
          : 'border-outline-variant/30 focus-within:border-primary'
          }`}
      >
        <span className="material-symbols-outlined text-on-surface-variant text-xl">lock</span>
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40 text-sm font-medium p-0"
        />
        <button
          type="button"
          onClick={onToggle}
          className="text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-xl">
            {show ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function UserProfilePage() {
  const { form, setForm, handleChange: formHandleChange } = useForm({
    name: '홍길동',
    email: 'user@mealbot.kr',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    formHandleChange(e);
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setSaved(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = '이름을 입력해주세요.';
    if (!form.email.trim()) newErrors.email = '이메일을 입력해주세요.';
    if (form.newPassword && !isPasswordMinLength(form.newPassword))
      newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다.';
    if (form.newPassword && !doPasswordsMatch(form.newPassword, form.confirmPassword))
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (form.newPassword && !form.currentPassword)
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // TODO: 백엔드 연결
    console.log('프로필 저장:', { name: form.name, email: form.email });
    setSaved(true);
    setForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  return (
    <Layout className="min-h-screen flex flex-col" style={{ backgroundColor: '#ffffff' }}>

      <main className="flex-1 flex justify-center px-6 pt-28 pb-16">
        <div className="w-full max-w-lg">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">내 프로필</h1>
            <p className="text-on-surface-variant text-sm mt-1">
              계정 정보를 확인하고 수정할 수 있습니다
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* 프로필 사진 카드 */}
            <Card className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-container flex items-center justify-center border-2 border-outline-variant/20">
                  {avatar ? (
                    <img src={avatar} alt="프로필 사진" className="w-full h-full object-cover" />
                  ) : (
                    <span
                      className="material-symbols-outlined text-on-surface-variant/50"
                      style={{ fontSize: '52px', fontVariationSettings: "'FILL' 1" }}
                    >
                      person
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined text-white" style={{ fontSize: '16px' }}>
                    photo_camera
                  </span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <div className="text-center">
                <p className="font-bold text-on-surface">{form.name || '이름 없음'}</p>
                <p className="text-sm text-on-surface-variant">{form.email}</p>
              </div>

              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-primary hover:text-primary"
              >
                사진 변경
              </Button>
            </Card>

            {/* 계정 정보 카드 */}
            <Card className="flex flex-col gap-5">
              <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                계정 정보
              </h2>

              {/* 이름 */}
              <TextField
                label="이름"
                icon="badge"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="홍길동"
                error={errors.name}
              />

              {/* 이메일 */}
              <TextField
                label="이메일"
                icon="mail"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="hello@mealbot.kr"
                error={errors.email}
              />
            </Card>

            {/* 비밀번호 변경 카드 */}
            <Card className="flex flex-col gap-5">
              <div>
                <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  비밀번호 변경
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">변경하지 않으려면 비워두세요</p>
              </div>

              <PasswordField
                label="현재 비밀번호"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                show={showCurrentPw}
                onToggle={() => setShowCurrentPw(v => !v)}
                error={errors.currentPassword}
                placeholder="현재 비밀번호 입력"
              />
              <PasswordField
                label="새 비밀번호"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                show={showNewPw}
                onToggle={() => setShowNewPw(v => !v)}
                error={errors.newPassword}
                placeholder="8자 이상"
              />
              <PasswordField
                label="새 비밀번호 확인"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                show={showConfirmPw}
                onToggle={() => setShowConfirmPw(v => !v)}
                error={errors.confirmPassword}
                placeholder="새 비밀번호 재입력"
              />
            </Card>

            {/* 저장 버튼 */}
            <Button
              type="submit"
              size="lg"
              className="w-full shadow-sm"
            >
              변경사항 저장
            </Button>

            {saved && (
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
                <span className="material-symbols-outlined text-base">check_circle</span>
                저장되었습니다
              </div>
            )}
          </form>
        </div>
      </main>
    </Layout>
  );
}
