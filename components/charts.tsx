import { chartPoints } from '@/lib/data';

function points(key: 'clicks' | 'conversions' | 'roas', max: number) {
  return chartPoints.map((point, index) => `${35 + index * 69},${155 - (point[key] / max) * 112}`).join(' ');
}

export function PerformanceChart() {
  return (
    <div className="h-56 w-full">
      <div className="mb-5 flex gap-6 text-xs font-medium text-slate-600">
        <span className="flex items-center gap-2"><i className="h-1 w-4 rounded bg-meta" />Clicks (Link)</span>
        <span className="flex items-center gap-2"><i className="h-1 w-4 rounded bg-cyan-500" />Conversions</span>
        <span className="flex items-center gap-2"><i className="h-1 w-4 rounded bg-violet-500" />ROAS (Purchase)</span>
      </div>
      <svg viewBox="0 0 520 190" className="h-full w-full overflow-visible">
        {[0, 1, 2, 3].map((line) => <line key={line} x1="30" x2="500" y1={35 + line * 38} y2={35 + line * 38} stroke="#e2e8f0" />)}
        <polyline fill="none" stroke="#0866ff" strokeWidth="3" points={points('clicks', 6500)} />
        <polyline fill="none" stroke="#06b6d4" strokeWidth="3" points={points('conversions', 4300)} />
        <polyline fill="none" stroke="#8b5cf6" strokeWidth="3" points={points('roas', 5)} />
        {chartPoints.map((point, index) => (
          <g key={point.day}>
            <circle cx={35 + index * 69} cy={155 - (point.clicks / 6500) * 112} r="4" fill="#0866ff" />
            <text x={24 + index * 69} y="184" className="fill-slate-500 text-[10px]">{point.day.replace('May ', '')}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
