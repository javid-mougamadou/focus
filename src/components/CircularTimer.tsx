type CircularTimerProps = {
  totalMs: number;
  remainingMs: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export default function CircularTimer({
  totalMs,
  remainingMs,
  size = 200,
  strokeWidth = 8,
  className = '',
}: CircularTimerProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalMs > 0 ? remainingMs / totalMs : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`-rotate-90 ${className}`}
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="opacity-20"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="transition-all duration-100 ease-linear"
      />
    </svg>
  );
}
