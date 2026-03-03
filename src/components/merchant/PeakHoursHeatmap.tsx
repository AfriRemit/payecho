import { useState, useMemo } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface PeakHoursHeatmapProps {
  /** 7×24 grid: density[row][col] = 0..1 normalized */
  data?: number[][];
}

function getDensityColor(d: number): string {
  if (d <= 0) return 'rgba(255,255,255,0.03)';
  if (d < 0.25) return 'rgba(0,179,126,0.2)';
  if (d < 0.5) return 'rgba(0,179,126,0.4)';
  if (d < 0.75) return 'rgba(0,179,126,0.6)';
  return 'rgba(0,179,126,0.85)';
}

export function PeakHoursHeatmap({ data }: PeakHoursHeatmapProps) {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null);

  const grid = useMemo(() => {
    if (data && data.length === 7 && data.every((r) => r.length === 24)) {
      return data;
    }
    const demo: number[][] = [];
    for (let r = 0; r < 7; r++) {
      demo[r] = [];
      for (let c = 0; c < 24; c++) {
        const peak = (c >= 9 && c <= 18) || (r >= 5 && r <= 6);
        demo[r][c] = peak ? 0.3 + Math.random() * 0.6 : Math.random() * 0.2;
      }
    }
    return demo;
  }, [data]);

  const hoverValue = hovered && grid[hovered.row]?.[hovered.col] != null
    ? (grid[hovered.row][hovered.col] * 100).toFixed(0)
    : null;

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <div className="min-w-[400px]">
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <div className="row-span-8 flex flex-col justify-center text-xs text-secondary pr-2">
              {DAYS.map((d) => (
                <div key={d} className="h-6 flex items-center">
                  {d}
                </div>
              ))}
            </div>
            <div className="flex gap-0.5 mb-1">
              {HOURS.map((h, idx) => (
                <div
                  key={idx}
                  className="w-3 text-center text-[10px] text-secondary"
                  title={`${h}:00`}
                >
                  {h % 6 === 0 ? h : ''}
                </div>
              ))}
            </div>
            <div className="col-span-1" />
            <div className="grid grid-rows-7 gap-0.5">
              {grid.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-0.5">
                  {row.map((cell, colIdx) => (
                    <div
                      key={colIdx}
                      className="w-3 h-6 rounded-sm transition-colors cursor-default"
                      style={{ backgroundColor: getDensityColor(cell) }}
                      title={`${DAYS[rowIdx]} ${colIdx}:00 — ${(cell * 100).toFixed(0)}%`}
                      onMouseEnter={() => setHovered({ row: rowIdx, col: colIdx })}
                      onMouseLeave={() => setHovered(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {hoverValue != null && (
        <p className="text-xs text-secondary">
          Hover: {hoverValue}% of normalised transaction density
        </p>
      )}
      <p className="text-xs text-secondary mt-1">
        Cell colour = normalised transaction density. Busiest times = darker green.
      </p>
    </div>
  );
}
