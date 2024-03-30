# pointing.arbelaez.dev

[![Deploy to Firebase Hosting on merge](https://github.com/odarbelaeze/pointing.arbelaez.dev/actions/workflows/firebase-hosting-merge.yml/badge.svg?branch=main)](https://github.com/odarbelaeze/pointing.arbelaez.dev/actions/workflows/firebase-hosting-merge.yml)

A small implementation of pointing poker using firebase and react.

## Development

Make sure you have node installed, the version should be `lts/iron` or higher.

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`

## Emulators

To run the project using the local firebase emulators.

1. Run `npm run start:emulators`
2. On a separate terminal run `npm run start:ui`

## Deploy

To run the deployment via this repositories CI/CD, push to the `main` branch.

To deploy manually:

1. Run `npm run firebase deploy`
