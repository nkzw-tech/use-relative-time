# @nkzw/use-relative-time

A zero-dependency React hook for formatting relative dates.

## Installation

```
npm install @nkzw/use-relative-time
```

## Usage

### `useRelativeTime()`

Here is an example of how to use `useRelativeTime()` to format a date relative to the current time:

```js
import useRelativeTime from '@nkzw/use-relative-time';

export default function BlogPostHeader({ title, time }) {
  const timeAgo = useRelativeTime(time);

  return (
    <>
      <h1>{title}</h1>
      <time>{timeAgo}</time>
    </>
  );
}
```

## Parameters

### `time: number`

The time in milliseconds that should be formatted relative to the current time.

### `locale: Intl.UnicodeBCP47LocaleIdentifier`, _defaults to `'en'`_

The locale used to format the date.

### `dateNow: () => number`, _defaults to `Date.now`_

The function to get the current time. You can provide an alternative implementation as source for the current time, like for example if you are syncing the time with a server.

## Notes

`useRelativeTime` depends on [`Intl.RelativeTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat). If you are [supporting older browsers](https://caniuse.com/mdn-javascript_builtins_intl_relativetimeformat), you can find a [polyfill in Format.JS](https://formatjs.io/docs/polyfills/intl-relativetimeformat/).

If `Intl.RelativeTimeFormat` is not available, `useRelativeTime` will gracefully fall back to a basic relative time representation that is not localized, such as "17h" instead of "17 hours ago" or "17 hours from now".
