import { Button, Card } from './ui';

export default function ConfirmDialog({ open, title, message, confirmLabel = '확인', cancelLabel = '취소', onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
      <Card as="div" className="relative w-full max-w-sm mx-4 flex flex-col gap-6 shadow-xl">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-extrabold text-on-surface tracking-tight">{title}</h2>
          {message && <p className="text-sm text-on-surface-variant leading-relaxed">{message}</p>}
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            size="sm"
            className="px-5"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            size="sm"
            className="px-5"
          >
            {confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}
