// features/analytics/analytics.service.ts
import axios from 'axios';
import { API_URL } from '../../config';

const URL = `${API_URL}/metrics`

// Получаем или создаем ID сессии (живет пока открыта вкладка)
const getSessionId = () => {
  let id = sessionStorage.getItem('analytics_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', id);
  }
  return id;
};

export const trackPageView = (url: string) => {
  const searchParams = new URLSearchParams(window.location.search);
  const data = {
    url,
    sessionId: getSessionId(),
    // Берем таймзону прямо из браузера!
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer,
    screen: `${window.screen.width}x${window.screen.height}`,
    utmSource: searchParams.get('utm_source'),
    utmMedium: searchParams.get('utm_medium'),
    utmCampaign: searchParams.get('utm_campaign'),
  };
  axios.post(`${URL}/page-view`, data);
};

export const trackPageExit = (url: string, startTime: number) => {
  const duration = Math.floor((Date.now() - startTime) / 1000);
  if (duration < 1) return;

  const data = JSON.stringify({
    url,
    sessionId: getSessionId(),
    durationSeconds: duration
  });

  // Blob нужен, чтобы сервер NestJS (body-parser) понял, что это JSON
  const blob = new Blob([data], { type: 'application/json' });
  navigator.sendBeacon(`${URL}/duration`, blob);
};

export const getSummaryStats = async () => {
  const res = await axios.get(`${URL}/stats/summary`);
  return res.data;
};

export const getPopularPages = async () => {
  const res = await axios.get(`${URL}/stats/pages`);
  return res.data;
};

export const getDetailedStats = async () => {
  const res = await axios.get(`${URL}/stats/detailed`);
  return res.data;
};