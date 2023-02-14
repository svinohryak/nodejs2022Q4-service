# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Rename `.env.example` to `.env`

## Installing NPM modules

```
npm install
```

## Build docker images

- ### application
  For Mac m1 use second line and comment first line in [Dockerfile](./Dockerfile).  
  For Windows and Linux use 1 line and comment second line in [Dockerfile](./Dockerfile).

```
npm run docker:build-app
```

- ### database

```
npm run docker:build-db
```

## Building and running docker

```
npm run docker:compose
```

## Scaning images

```
npm run docker:scan
```

## [Link to my Docker Hub](https://hub.docker.com/repository/docker/svinohryak/rest-service/general)

## Running application

```
npm start
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
