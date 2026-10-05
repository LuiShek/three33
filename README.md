# 3:33

A minimal clock and stopwatch app for Android, built with React Native and Expo.

## What it does

- Live clock (HH:MM:SS) with the seconds highlighted in gold
- Full stopwatch with centisecond precision — start, stop, reset
- Automatic dark / light theme following the system setting
- Tabular number alignment so digits never jitter

## Install

Download the latest APK and install it on your Android device:

https://expo.dev/accounts/luitelstar/projects/three33/builds/ab79bd1c-d998-4f4c-b0fa-4ef2c0b43800

Open the link on the phone, allow "install from unknown sources", tap install. The app then runs standalone — no dev server, no USB, no Expo Go.

## Development

```bash
npm install
npm start          # start the Expo dev server
npm run android    # run on a connected Android device
```

## Build

```bash
npx eas build --platform android --profile preview
```

The `preview` profile builds a directly-installable APK. `production` builds an AAB for the Play Store.

## Stack

- Expo SDK 57
- React Native 0.86
- React 19

## License

MIT — see [LICENSE](LICENSE). Copyright (c) 2026 Abishek Luitel.
