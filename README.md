# REY SDK for JavaScript
[![Build Status][travis-image]][travis-url]
[![Coverage][codecov-image]][codecov-url]
[![Dependency Status][depstat-image]][depstat-url]

> :warning: **WARNING:** This project is still in alpha, so the SDK interface might change

```
$ yarn install reputation-network/rey-sdk-js
```

## Usage
_TODO_

## Docs
_TODO_

## Running the tests
```
$ yarn install
$ yarn test
```

## Publishing a new version
- Make sure you are on a  **clean working directory**: no staged files, no unstaged files
- Run `yarn version`, when prompted, insert the new version number. This command will build the library and commit the changes tagged with the version. Running `git log -1` afterwards should show a commit with the new version.
- Push the changes with `git push origin master --follow-tags`

## LICENSE
MIT © 2018 [Reputation Network](./LICENSE)

[travis-image]: https://travis-ci.org/reputation-network/rey-sdk-js.svg?branch=master
[travis-url]: https://travis-ci.org/reputation-network/rey-sdk-js
[codecov-image]: https://codecov.io/github/reputation-network/rey-sdk-js/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/reputation-network/rey-sdk-js?branch=master
[depstat-image]: https://img.shields.io/david/reputation-network/rey-sdk-js/master.svg
[depstat-url]: https://david-dm.org/reputation-network/rey-sdk-js
