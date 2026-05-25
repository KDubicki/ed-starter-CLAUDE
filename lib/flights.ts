import fs from 'fs';
import path from 'path';
import type { Flight } from '@/types';

const dataPath = path.join(process.cwd(), 'data', 'flights.json');
const seedPath = path.join(process.cwd(), 'data', 'flights.seed.json');

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function isDeparted(nowMinutes: number, depMinutes: number): boolean {
  return nowMinutes > depMinutes + 10;
}

function isBoarding(nowMinutes: number, depMinutes: number): boolean {
  return nowMinutes >= depMinutes - 25;
}

function isDelayed(flight: Flight): boolean {
  return !!flight.delayMinutes;
}

function getCurrentMinutes(now: Date = new Date()): number {
  return now.getHours() * 60 + now.getMinutes();
}

function getEffectiveDepartureMinutes(flight: Flight): number {
  return toMinutes(flight.departureTime) + (flight.delayMinutes ?? 0);
}

function computeDynamicStatus(flight: Flight, nowMinutes: number, depMinutes: number): Flight['status'] {
  if (isDeparted(nowMinutes, depMinutes)) {
    return 'Departed';
  }

  if (isBoarding(nowMinutes, depMinutes)) {
    return 'Boarding';
  }

  if (isDelayed(flight)) {
    return 'Delayed';
  }

  return 'On Time';
}

function computeFlightStatus(flight: Flight): Flight {
  if (flight.status === 'Cancelled') return flight;

  const nowMinutes = getCurrentMinutes();
  const depMinutes = getEffectiveDepartureMinutes(flight);
  const status = computeDynamicStatus(flight, nowMinutes, depMinutes);

  return { ...flight, status };
}

export function readFlights(): Flight[] {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const flights = JSON.parse(raw) as Flight[];
  return flights.map(computeFlightStatus);
}

export function writeFlights(flights: Flight[]): void {
  fs.writeFileSync(dataPath, JSON.stringify(flights, null, 2), 'utf-8');
}

export function resetToSeed(): Flight[] {
  const raw = fs.readFileSync(seedPath, 'utf-8');
  const seed = JSON.parse(raw) as Flight[];
  writeFlights(seed);
  return seed.map(computeFlightStatus);
}
