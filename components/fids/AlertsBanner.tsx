'use client';

import { useEffect, useState } from 'react';
import type { Flight } from '@/types';

interface AlertsData {
  alerts: Flight[];
  count: number;
}

export function AlertsBanner() {
  const [alerts, setAlerts] = useState<Flight[]>([]);

  useEffect(() => {
    function fetchAlerts() {
      fetch('/api/flights/alerts')
        .then((r) => r.json())
        .then((data: AlertsData) => setAlerts(data.alerts))
        .catch(() => {});
    }

    fetchAlerts();
    const id = setInterval(fetchAlerts, 30_000);
    return () => clearInterval(id);
  }, []);

  if (alerts.length === 0) return null;

  const cancelled = alerts.filter((f) => f.status === 'Cancelled');
  const delayed = alerts.filter((f) => f.status === 'Delayed');

  return (
    <div className="bg-zinc-950 border-b border-red-900/40 px-6 py-2 flex items-center gap-6 text-xs overflow-x-auto">
      <span className="text-red-400 uppercase tracking-widest font-bold shrink-0">
        ⚠ Alerts
      </span>

      {cancelled.length > 0 && (
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-zinc-500 uppercase tracking-wider shrink-0">Cancelled:</span>
          {cancelled.map((f) => (
            <span key={f.id} className="text-red-400 font-bold whitespace-nowrap">
              {f.flightNumber} {f.destination}
            </span>
          ))}
        </div>
      )}

      {delayed.length > 0 && (
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-zinc-500 uppercase tracking-wider shrink-0">Delayed:</span>
          {delayed.map((f) => (
            <span key={f.id} className="text-yellow-400 whitespace-nowrap">
              {f.flightNumber} {f.destination}
              {f.delayMinutes ? ` +${f.delayMinutes}min` : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
