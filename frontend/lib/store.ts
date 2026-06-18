'use client';

import { ConsultState, Gender, Client } from './types';

const CONSULT_KEY = 'salon_consult';

export function getConsultState(): ConsultState {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = sessionStorage.getItem(CONSULT_KEY);
    if (!raw) return defaultState();
    return JSON.parse(raw);
  } catch {
    return defaultState();
  }
}

export function setConsultState(patch: Partial<ConsultState>): void {
  const current = getConsultState();
  const next = { ...current, ...patch };
  sessionStorage.setItem(CONSULT_KEY, JSON.stringify(next));
}

export function clearConsultState(): void {
  sessionStorage.removeItem(CONSULT_KEY);
}

function defaultState(): ConsultState {
  return {
    gender: null,
    client: null,
    photoPreviews: [],
    selectedServiceIds: [],
    description: '',
    sessionId: null,
  };
}
