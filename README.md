# WIP: the-proton
This is a work in progress, please refer to [this issue](https://github.com/distributev/the-proton/issues/1) for the current status.

## To run on Development mode:

- Clone the repo `git clone git@github.com:distributev/the-proton.git`
- On the root folder, run `npm install`, (or `yarn` if using yarn instead of npm) 
- Then run `gulp start`, the electron app should open on a new native window after some initial build time.

## To package the app for specific OS

- `gulp package-win` for Windows ia32 and x64 packages
- `gulp package-linux` for Linux ia32 and x64 packages
- `gulp package-osx` for MacOS (OSX) x64 package

## To run the e2e tests

-  `gulp test:e2e`