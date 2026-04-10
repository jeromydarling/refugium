interface LegendItem {
  color: string;
  label: string;
}

interface MapLegendProps {
  items: LegendItem[];
  className?: string;
}

export default function MapLegend({ items, className = '' }: MapLegendProps) {
  if (items.length === 0) return null;

  return (
    <div
      className={`glass-card absolute bottom-3 left-3 z-10 px-3 py-2 ${className}`}
    >
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs font-medium text-slate-600">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
