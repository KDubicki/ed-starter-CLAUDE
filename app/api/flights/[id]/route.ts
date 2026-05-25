import { NextResponse } from 'next/server';
import { readFlights } from '@/lib/flights';
import { withMiddleware } from '@/lib/withMiddleware';

export const GET = withMiddleware(async (_req, ctx) => {
  const { id } = await ctx!.params;
  const flights = readFlights();
  const flight = flights.find((f) => f.id === id);
  if (!flight) return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
  return NextResponse.json(flight);
});
