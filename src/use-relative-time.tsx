import { useEffect, useMemo, useState } from 'react';

const second = 1000;
const minute = 60 * 1000;
const hour = minute * 60;
const day = hour * 24;
const month = day * 30;
const year = day * 365;

export default function useRelativeTime(
  time: number,
  locale:
    | Intl.UnicodeBCP47LocaleIdentifier
    | Array<Intl.UnicodeBCP47LocaleIdentifier> = 'en',
  dateNow = Date.now,
) {
  const [now, setNow] = useState(() => dateNow());

  useEffect(() => {
    if (now - time < minute) {
      const interval = setInterval(() => setNow(dateNow()), 10_000);
      return () => clearInterval(interval);
    }
  }, [dateNow, now, time]);

  const intl = useMemo(() => {
    try {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    } catch {
      return null;
    }
  }, [locale]);

  return useMemo(() => {
    const relativeTime = now - time;
    const elapsed = Math.abs(relativeTime);
    if (!intl) {
      return fallback(elapsed);
    }

    const sign = Math.sign(-relativeTime);
    if (elapsed < minute) {
      return intl.format(sign * Math.round(elapsed / second), 'second');
    } else if (elapsed < hour) {
      return intl.format(sign * Math.round(elapsed / minute), 'minute');
    } else if (elapsed < day) {
      return intl.format(sign * Math.round(elapsed / hour), 'hour');
    } else if (elapsed < month) {
      return intl.format(sign * Math.round(elapsed / day), 'day');
    } else if (elapsed < year) {
      return intl.format(sign * Math.round(elapsed / month), 'month');
    } else {
      return intl.format(sign * Math.round(elapsed / year), 'year');
    }
  }, [now, time, intl]);
}

const fallback = (elapsed: number) => {
  if (elapsed < minute) {
    return `${Math.round(elapsed / second)}s`;
  }
  if (elapsed < hour) {
    return `${Math.round(elapsed / minute)}m`;
  }
  if (elapsed < day) {
    return `${Math.round(elapsed / hour)}h`;
  }
  if (elapsed < month) {
    return `${Math.round(elapsed / day)}d`;
  }
  if (elapsed < year) {
    return `${Math.round(elapsed / month)}mo`;
  }
  return `${Math.round(elapsed / year)}y`;
};
