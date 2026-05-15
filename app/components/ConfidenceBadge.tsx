'use client'

interface Props { percent: number; label: string }

export default function ConfidenceBadge({ percent, label }: Props) {
  const s =
    percent >= 80
      ? { bar: '#16a34a', text: '#166534', bg: '#dcfce7', border: '#bbf7d0' }
      : percent >= 60
      ? { bar: '#d97706', text: '#92400e', bg: '#fef3c7', border: '#fde68a' }
      : { bar: '#dc2626', text: '#991b1b', bg: '#fee2e2', border: '#fecaca' }

  return (
    <div className="flex items-center gap-3">
      <span
        className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0"
        style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
      >
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, background: s.bar }}
        />
      </div>
      <span
        className="text-[11px] font-bold mono flex-shrink-0 w-10 text-right"
        style={{ color: s.text }}
      >
        {percent}%
      </span>
    </div>
  )
}
