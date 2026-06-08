import { SectionHeader } from '../../../shared/components/ui';

export default function SectionTitle({ eyebrow, title, sub }) {
  return (
    <SectionHeader
      eyebrow={eyebrow}
      title={title}
      caption={sub}
      className="[&>div>div>h2]:text-xl [&>div>div>p]:text-sm"
    />
  );
}
