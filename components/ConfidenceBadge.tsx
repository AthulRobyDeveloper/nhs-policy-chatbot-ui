'use client'

interface ConfidenceBadgeProps {
  percent: number
  label:   string
}

export default function ConfidenceBadge({
  percent,
  label
}: ConfidenceBadgeProps) {

  const isHigh   = percent >= 70
  const isMedium = percent >= 45 && percent < 70
  const isLow    = percent < 45

  const colour = isHigh
    ? 'bg-green-50 text-green-800 border-green-200'
    : isMedium
    ? 'bg-amber-50 text-amber-800 border-amber-200'
    : 'bg-red-50 text-red-800 border-red-200'

  const dot = isHigh
    ? 'bg-green-500'
    : isMedium
    ? 'bg-amber-500'
    : 'bg-red-500'

  const icon = isHigh ? '✓' : isMedium ? '~' : '!'

  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1.5
      rounded-full border text-xs font-medium
      ${colour}
    `}>
      <span className={`
        w-4 h-4 rounded-full flex items-center 
        justify-center text-white text-xs font-bold
        ${dot}
      `}>
        {icon}
      </span>
      <span>{percent}% — {label}</span>
    </div>
  )
}
