import { renderHook } from '@testing-library/react-hooks';
import { afterEach, expect, test } from 'vitest';
import useRelativeTime from '../src/use-relative-time.tsx';

const now = Date.now();

const RelativeTimeFormat = Intl.RelativeTimeFormat;
afterEach(() => {
  Object.defineProperty(Intl, 'RelativeTimeFormat', {
    value: RelativeTimeFormat,
    writable: true,
  });
});

test('should return the correct relative time', () => {
  let { result } = renderHook(() => useRelativeTime(now - 100_000));
  expect(result.current).toMatchInlineSnapshot('"2 minutes ago"');

  ({ result } = renderHook(() => useRelativeTime(now - 100_000, 'de')));
  expect(result.current).toMatchInlineSnapshot('"vor 2 Minuten"');

  ({ result } = renderHook(() => useRelativeTime(now - 100_000, 'ja')));
  expect(result.current).toMatchInlineSnapshot('"2 分前"');

  ({ result } = renderHook(() =>
    useRelativeTime(now, 'en', () => now - 20_000_000_000),
  ));

  expect(result.current).toMatchInlineSnapshot('"in 8 months"');

  ({ result } = renderHook(() =>
    useRelativeTime(now, 'en', () => now + 2_000_000_000),
  ));

  expect(result.current).toMatchInlineSnapshot('"23 days ago"');
});

test('should fall back to basic rendering when `Intl.RelativeTimeFormat` is not available', () => {
  Object.defineProperty(Intl, 'RelativeTimeFormat', {
    value: undefined,
    writable: true,
  });

  let { result } = renderHook(() => useRelativeTime(now - 100_000));
  expect(result.current).toMatchInlineSnapshot('"2m"');

  // The fallback prints the same output for past and future dates.
  ({ result } = renderHook(() => useRelativeTime(now + 100_000)));
  expect(result.current).toMatchInlineSnapshot('"2m"');
});
