'use client'

interface ConfidenceBadgeProps {
  percent: number
  label:   string
}

export default function ConfidenceBadge({ percent, label }: ConfidenceBadgeProps) {
  const c =
    percent >= 80
      ? { bar: '#16a34a', text: '#166534', bg: '#dcfce7', border: '#bbf7d0' }
      : percent >= 60
      ? { bar: '#d97706', text: '#92400e', bg: '#fef3c7', border: '#fde68a' }
      : { bar: '#dc2626', text: '#991b1b', bg: '#fee2e2', border: '#fecaca' }

  return (
    <div className="flex items-center gap-2.5">
      {/* Label pill */}
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap flex-shrink-0"
        style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
      >
        {label}
      </span>

      {/* Progress bar */}
      <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, background: c.bar }}
        />
      </div>

      {/* Percent */}
      <span
        className="text-[11px] font-bold font-mono flex-shrink-0"
        style={{ color: c.text }}
      >
        {percent}%
      </span>
    </div>
  )
}
