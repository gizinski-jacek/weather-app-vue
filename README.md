# Weather App Vue

A refresh of my old Weather App project build to practice Vuejs using [OpenWeatherMap API](https://openweathermap.org/api) for weather data.

## Table of contents

- [Github & Live](#github--live)
- [Getting Started](#getting-started)
- [Deploy](#deploy)
- [Features](#features)
- [Status](#status)
- [Contact](#contact)

# Github & Live

Github repo can be found [here](https://github.com/gizinski-jacek/weather-app-vue).

Live demo can be found on [Vercel](https://weather-app-vue-sandy.vercel.app/).

# Getting Started

Install all dependancies by running:

```bash
npm install
```

In the project root directory run the app with:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

Don't forget to add **.env** file with OpenWeather VITE_API_KEY environment variable.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

## Deploy

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Don't forget to add **.env** file with these environment variables for the app:

```
VITE_API_KEY
```

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Features

- Display current, hourly and daily weather forecast data for given location
- Widgets with extra weather information (e.g. pressure, UVI, wind speed, air pollution)
- Overlay tooltips for icons and extra data
- Search by city name and display results
- Support for geolocation
- Display data in metric or imperial units
- Save user's geolocation and unit preferences in local storage
- Built with RWD in mind

## Status

Project status: **_FINISHED_**

## Contact

Feel free to contact me at:

```
gizinski.jacek.tr@gmail.com
```
