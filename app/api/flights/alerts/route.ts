import { NextResponse } from 'next/server';
import { readFlights } from '@/lib/flights';
import { withMiddleware } from '@/lib/withMiddleware';

// GET /api/flights/alerts — returns flights requiring attention (Delayed or Cancelled)
export const GET = withMiddleware(async () => {
  const flights = readFlights();
  const alerts = flights.filter((f) => f.status === 'Delayed' || f.status === 'Cancelled');
  return NextResponse.json({ alerts, count: alerts.length });
});
