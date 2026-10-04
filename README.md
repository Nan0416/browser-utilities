# browser-utilities

![release workflow](https://github.com/Nan0416/browser-utilities/actions/workflows/release.yml/badge.svg)

![Latest PR workflow](https://github.com/Nan0416/browser-utilities/actions/workflows/pr.yml/badge.svg)

[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

Small TypeScript utilities for browser apps.

```sh
npm install @ultrasa/browser-utilities
```

## Clipboard

```ts
import { copyToClipboard } from '@ultrasa/browser-utilities';

// Uses navigator.clipboard, which requires a secure context (https or localhost).
// Throws if the API is unavailable or the browser rejects the write.
await copyToClipboard('some text');
```

## Download JSON

The download helpers live in a separate entry point, so apps that don't use them don't bundle `jszip` and `file-saver`.

```ts
import { downloadJson, downloadJsonZip } from '@ultrasa/browser-utilities/download';

// Object keys are sorted, so the output is deterministic.
downloadJson({ filename: 'settings.json', content: { theme: 'dark' } });

await downloadJsonZip('export.zip', [
  { filename: 'users.json', content: users },
  { filename: 'orders.json', content: orders },
]);
```

## Format duration

```ts
import { formatDuration } from '@ultrasa/browser-utilities';

formatDuration(0); // '0s'
formatDuration(10890); // '3h 1m 30s'
formatDuration(90000); // '25h'
```

## Preferences

Values are stored in `localStorage` as JSON. `getPreference` returns the default when the key is missing, the stored data is corrupted, or `localStorage` is unavailable. `setPreference` returns `false` if the value couldn't be saved.

```ts
import { getPreference, setPreference } from '@ultrasa/browser-utilities';

setPreference('pageSize', 50);
const pageSize = getPreference('pageSize', 20);
```

## Temporary cache

An in-memory cache whose entries are removed after a timeout in milliseconds. A timeout `<= 0` means the entry never expires.

```ts
import { GenericTempCache } from '@ultrasa/browser-utilities';

const cache = new GenericTempCache(1000); // default timeout, 200ms if omitted
cache.set('user', user);
cache.set('token', token, 60_000);
cache.get<User>('user');
cache.expire('user');
cache.clear();
```

## Stage configuration

Look up the configuration for the current deployment of your website.

```ts
import { StageConfiguration, WebsiteConfigAccessor } from '@ultrasa/browser-utilities';

interface MyStageConfiguration extends StageConfiguration {
  readonly stage: 'beta' | 'prod';
  readonly apiEndpoint: string;
}

const accessor = new WebsiteConfigAccessor<MyStageConfiguration>([
  { id: 'beta', domain: 'beta.example.com', stage: 'beta', apiEndpoint: 'https://api.beta.example.com' },
  { id: 'prod', domain: 'example.com', stage: 'prod', apiEndpoint: 'https://api.example.com' },
]);

// Throws if no configuration, or more than one, matches.
const config = accessor.getStageConfigurationByDomain(window.location.host);
```

## License

MIT
