![Logo](./public/logo/full.svg)

# Regla Platform V2

This project is dedicated to the Regla Project, aimed at addressing complex back-to-back requirements that can sometimes be challenging. The goal is to modernize and revamp this project as long as I remain part of the team.

## Optimization

> The project includes several improvements, such as enhanced performance, an improved user experience, and cleaner code architecture.

## Environment Variables

To run this project locally, you must include the following environment variables in your .env file

```
NEXT_PUBLIC_BASE_API=https://webapp-dev.regla.cloud/api
NEXT_PUBLIC_APP_ID=PLATFORM_CENTER
```

## Tech Stack

**Client:** React + NextJS, Chakra UI

**Server:** NodeJS

## Features

- **Theme Mode**: Users can customize their theme preference, which is stored server-side.
- **Dynamic Routing**: The platform supports parallel, intercepting, and dynamic routes based on API responses.
- **Role-Based Access Control (RBAC)**: Pages and features are displayed based on user privileges.
- **Sticky Sidebar and Header**: These elements remain fixed for better user navigation.
- **Animated Routing**: Page transitions include slide-in and fade-in animations.
- **TBD**: Additional features will be added in future updates.

## Under Development

- **Websocket**: Real-time silent and noisy updates for live notifications.
- **Download Toolbar**: **50% Current Progress**, Users can download files from toolbar button.

## Installation & Development

This project is intended for internal use only. To set up, you must first download WireGuard and request the necessary user credentials.

To ensure better performance, please use `bun` as the package manager.

Clone the repository and navigate to the project folder:

```bash
    $ git clone git@github.com:LangRizkie/regla-v2.git
    $ cd regla-v2
    $ bun install
```

Run the development server:

```bash
    $ bun dev
```

# Project Structure

The directory structure is as follows:

```bash
├───public                                  (public folder to serve static assets)
│   ├───login
│   ├───logo
│   └───request-unlock
└───src                                     (source folder containing main application code)
    ├───app                                 (application folder for main pages)
    │   ├───(sidebar)                       (route group)
    │   │   ├───@modal                      (named slot routes)
    │   │   │   └───(.)platform_center      (intercepting routes)
    │   │   │       └───[[...slug]]         (optional catch-all routes)
    │   │   └───platform_center             (platform_center route)
    │   │       └───[[...slug]]             (intercepted optional catch-all routes)
    │   ├───forgot-password                 (static forgot-password route)
    │   │   └───[token]                     (dynamic route)
    │   ├───main                            (static main route)
    │   └───request-unlock                  (static request-unlock route)
    │       └───otp                         (static request-unlock/otp route)
    ├───components                          (components folder)
    │   ├───pages                           (component for page UI)
    │   │   ├───general_security
    │   │   └───notification_setting
    │   └───ui                              (component for reusable UI)
    ├───config                              (base configuration library)
    ├───hooks                               (reusable hook helper)
    ├───libraries                           (repeat usability library)
    │   ├───mutation                        (mutation folder)
    │   │   ├───platform-settings
    │   │   └───user
    │   └───schemas                         (schema validation folder)
    │       └───user
    ├───stores                              (Zustand store management)
    ├───types                               (TypeScript type definitions)
    │   ├───platform-settings
    │   └───user
    └───utilities                           (utility functions and constants)
```

## Developer

- [@langrizkie](https://github.com/LangRizkie)
