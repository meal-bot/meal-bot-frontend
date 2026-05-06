import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../../shared/components/layout/Layout';
import { BASIC_FIELDS, ADVANCED_FIELDS, ACTIVITY_LEVELS } from '../data/inbodyData';
import { saveInbody } from '../api/inbodyApi';

/**
 * 인바디 측정값 입력 페이지 — /inbody/new
 *
 * 입력 항목을 두 단계로 분리:
 *  1) 기본 정보 (키/체중/나이/성별) - 누구나 알 수 있는 값
 *  2) 상세 측정값 (인바디 기기 결과지 필요) - 표준 8종 중 기기에서만 나오는 값
 */
export default function InBodyInputPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    height: '', weight: '', age: '', gender: '남성', activityLevel: 1.55,
    skeletalMuscle: '', bodyFat: '', bodyFatPercent: '',
    protein: '', mineral: '', bodyWater: '', visceralFat: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const errors = {};
    BASIC_FIELDS.forEach(field => {
      if (field.options) return;
      const value = parseFloat(form[field.key]);
      if (!form[field.key]) errors[field.key] = '필수 입력';
      else if (isNaN(value) || value < field.min || value > field.max) errors[field.key] = `${field.min}-${field.max} ${field.unit} 범위`;
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      await saveInbody(form);
      navigate('/inbody');
    } catch {
      setErrors({ _global: '저장에 실패했습니다. 다시 시도해주세요.' });
    }
  };

  const filledAdvanced = ADVANCED_FIELDS.filter(field => form[field.key] !== '').length;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* 페이지 헤더 */}
        <header className="mb-10">
          <Link to="/inbody" className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface mb-4 transition-colors">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            대시보드로
          </Link>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">새 측정 기록</h1>
              <p className="text-on-surface-variant text-sm mt-1.5">
                인바디 결과지를 보며 입력해주세요. 비워두면 표시되지 않습니다.
              </p>
            </div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-1 hidden sm:block">
              {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* ───── STEP 1. 기본 정보 ───── */}
          <section className="bg-white rounded-[2rem] shadow-sm border border-outline-variant/20 p-8">
            <SectionHeader
              step="01"
              title="기본 정보"
              caption="누구나 알 수 있는 값"
              tone="primary"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {BASIC_FIELDS.map(field =>
                field.options ? (
                  <SegmentedField
                    key={field.key}
                    field={field}
                    value={form[field.key]}
                    onChange={(v) => handleChange(field.key, v)}
                  />
                ) : (
                  <NumberField
                    key={field.key}
                    field={field}
                    value={form[field.key]}
                    onChange={(v) => handleChange(field.key, v)}
                    error={errors[field.key]}
                  />
                )
              )}
            </div>
          </section>

          {/* ───── STEP 1.5. 활동 수준 ───── */}
          <section className="bg-white rounded-[2rem] shadow-sm border border-outline-variant/20 p-8">
            <SectionHeader
              step="02"
              title="활동 수준"
              caption="일일 권장 칼로리 계산에 사용"
              tone="primary"
            />
            <div className="grid grid-cols-5 gap-2 mt-6">
              {ACTIVITY_LEVELS.map(level => (
                <button
                  key={level.factor}
                  type="button"
                  onClick={() => handleChange('activityLevel', level.factor)}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-center transition-all ${
                    form.activityLevel === level.factor
                      ? 'bg-primary text-white border-primary'
                      : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  <span className="text-xs font-bold leading-tight">{level.label}</span>
                  <span className={`text-[10px] leading-tight ${form.activityLevel === level.factor ? 'text-white/80' : 'text-on-surface-variant/60'}`}>
                    {level.description}
                  </span>
                  <span className={`text-[11px] font-extrabold mt-0.5 ${form.activityLevel === level.factor ? 'text-white' : 'text-primary'}`}>
                    ×{level.factor}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* ───── STEP 3. 상세 측정값 ───── */}
          <section className="bg-surface-container-low rounded-[2rem] border border-outline-variant/40 p-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <SectionHeader
                step="03"
                title="상세 측정값"
                caption="인바디 기기 결과지 필요"
                tone="secondary"
              />
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap pt-2">
                {filledAdvanced}/{ADVANCED_FIELDS.length} 입력됨
              </span>
            </div>

            {/* 안내 박스 */}
            <div className="flex items-start gap-3 bg-secondary-container/50 rounded-xl px-4 py-3 mt-4 mb-6">
              <span className="material-symbols-outlined text-secondary text-xl mt-0.5">lightbulb</span>
              <p className="text-xs leading-relaxed text-on-surface">
                <span className="font-bold">결과지에서 찾는 법: </span>
                인바디 결과지 좌측 상단의 <em className="not-italic font-semibold">"체성분 분석"</em> 표를 참고하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ADVANCED_FIELDS.map(field => (
                <AdvancedField
                  key={field.key}
                  field={field}
                  value={form[field.key]}
                  onChange={(v) => handleChange(field.key, v)}
                />
              ))}
            </div>
          </section>

          {/* 전송 에러 메시지 */}
          {errors._global && (
            <p className="text-sm text-red-500 font-medium text-center">{errors._global}</p>
          )}

          {/* 저장 액션 */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/inbody')}
              className="px-6 py-4 rounded-2xl border border-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">check</span>
              측정 기록 저장
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

/* ───────────────────────── 서브컴포넌트 ───────────────────────── */

function SectionHeader({ step, title, caption, tone }) {
  const toneClass = tone === 'secondary' ? 'bg-secondary-container text-secondary' : 'bg-primary-container text-primary';
  return (
    <div className="flex items-center gap-3">
      <span className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${toneClass}`}>
        STEP {step}
      </span>
      <div>
        <h2 className="text-lg font-extrabold text-on-surface tracking-tight">{title}</h2>
        <p className="text-xs text-on-surface-variant">{caption}</p>
      </div>
    </div>
  );
}

function NumberField({ field, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
        {field.label}
      </label>
      <div className={`flex items-center gap-3 bg-surface-container rounded-xl px-4 py-3.5 border transition-colors ${
        error ? 'border-red-300 focus-within:border-red-400' : 'border-outline-variant/30 focus-within:border-primary'
      }`}>
        <span className="material-symbols-outlined text-on-surface-variant text-xl">{field.icon}</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40 text-sm font-medium p-0 min-w-0"
        />
        {field.unit && (
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{field.unit}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SegmentedField({ field, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
        {field.label}
      </label>
      <div className="flex items-center gap-1 bg-surface-container rounded-xl p-1 border border-outline-variant/30">
        {field.options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              value === opt
                ? 'bg-white text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function AdvancedField({ field, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          {field.label}
        </label>
        <span className="text-[10px] text-on-surface-variant/60">{field.hint}</span>
      </div>
      <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-outline-variant/30 focus-within:border-primary transition-colors">
        <span className="material-symbols-outlined text-on-surface-variant text-xl">{field.icon}</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="-"
          className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40 text-sm font-medium p-0 min-w-0"
        />
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{field.unit || '—'}</span>
      </div>
    </div>
  );
}
