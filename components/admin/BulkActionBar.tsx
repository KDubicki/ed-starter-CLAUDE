'use client';

import { useState } from 'react';
import type { FlightStatus } from '@/types';
import { ALL_STATUSES } from '@/types';

interface BulkActionBarProps {
  selectedCount: number;
  loading: boolean;
  onStatusChange: (status: FlightStatus) => void;
  onDelete: () => void;
  onClear: () => void;
}

export function BulkActionBar({
  selectedCount,
  loading,
  onStatusChange,
  onDelete,
  onClear,
}: BulkActionBarProps) {
  const [status, setStatus] = useState<FlightStatus | ''>('');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-amber-700/40 px-6 py-3 flex items-center gap-4 z-50 font-mono">
      <span className="text-sm text-amber-400 font-bold shrink-0">{selectedCount} selected</span>

      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as FlightStatus | '')}
          className="bg-board-row border border-board-border text-board-text text-xs px-3 py-1.5 rounded focus:outline-none focus:border-amber-600"
        >
          <option value="">Set Status…</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            if (status) onStatusChange(status as FlightStatus);
          }}
          disabled={!status || loading}
          className="text-xs border border-amber-700 text-amber-400 hover:bg-amber-900/30 px-4 py-1.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Apply
        </button>
      </div>

      <button
        onClick={onDelete}
        disabled={loading}
        className="text-xs border border-red-800 text-red-400 hover:bg-red-900/20 px-4 py-1.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Delete Selected
      </button>

      <button
        onClick={() => {
          onClear();
          setStatus('');
        }}
        className="ml-auto text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        ✕ Clear
      </button>
    </div>
  );
}
