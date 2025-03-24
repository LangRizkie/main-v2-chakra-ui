![Logo](https://webapp-dev.regla.cloud/ifrs9/logo.svg)

# Regla Platform V2

This project is fully dedicated to Regla Project, dealing with back to back requirement sometimes brain hurting. So I decided to remake/revamp this project as long as I'm in the team.

## Optimization

> With some improved performance, user experience and cleaner code.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```
NEXT_PUBLIC_BASE_API=https://webapp-dev.regla.cloud/api
NEXT_PUBLIC_APP_ID=PLATFORM_CENTER
```

## Tech Stack

**Client:** React + NextJS, Chakra UI

**Server:** NodeJS

## Features

- Theme mode, user can change their theme preference server-sided
- Parallel, intercepting and dynamic routes based on response
- RBAC system, all pages and features based on user privilege
- Sticky Sidebar and Header
- Animated routing with slide-in and fade-in transition
- TBD

## Installation & Development

use **ONLY** `bun` for better performance

Install `regla-v2`

```bash
    $ cd regla-v2
    $ bun install
```

run with

```bash
    $ bun dev
```

# Project Structure

```bash
├───public                                  (public folder to serve local assets)
│   ├───login
│   ├───logo
│   └───request-unlock
└───src                                     (source folder)
    ├───app                                 (app folder for main pages)
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
    ├───stores                              (zustand store)
    ├───types                               (type interface)
    │   ├───platform-settings
    │   └───user
    └───utilities                           (reusable function/constant)
```

## Developer

- [@langrizkie](https://github.com/LangRizkie)
