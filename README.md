[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Tunefind
========

API client for [tunefind](http://tunefind.com)


## Setup

`npm install --save tunefind`

## Features

- supports basic all endpoints with optional query parameters
- provides an interface for callbacks and promises
- automatically caches results using [cacheman](https://github.com/cayasso/cacheman),
	invalidation is based on LRU with boundings defined by TTL, memory or entries size

## API

```js
import { Client } from 'tunefind'

const client = new Client({
	credentials: {
		username: '...',
		password: '...'
	}
})
```

A complete example can be found [here](/example/shows.js)

For more checkout the [official documentation](http://www.tunefind.com/api)
