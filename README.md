This is a social media promotion app that uses Nextjs framework for frontend and Firebase for backend. It also fetch services direct from api servies.Users can create account and login to the app using clerk authentication.

## Features

- User can create account and login to the app using clerk authentication.
- User can fund his wallet and withdraw funds.
- User can buy services.
- User can view services.
- User can view transactions.
- User can view balance.
- User can buy account

## Technologies

- Nextjs
- Firebase
- Clerk
- Tailwindcss
- Typescript

## Installation

- `npm install`
- `npm run dev` or `yarn dev`

## Deployment

- `npm run build`
- `firebase deploy`

## Folder structure

- app
  - (auth)
    - sign-in
      - [[...sign-in]]
    - sign-up
      - [[...sign-up]]
  - dashboard
    - financial-details
      - [type]
        - [id]
    - layout.tsx
    - page.tsx
  - admin
    - members
    - finances
    - layout.tsx
    - page.tsx
  - layout.tsx
  - page.tsx
- components

  - ui
  - formDataComponents
    - BuyAccountSection
    - CategorySelection
    - Header
    - OrderFormSection
    - QuickActions
    - UserStat
  - Payment
    - ConfirmPayment
    - FlutterwavePayment
    - SingleTransaction
    - TransactionStatus
  - tawkTo
    - TawkTo
  - users
    - BalanceHook
    - DbErrorMessage
    - DbLoadingSpinner
    - Footer
    - HeaderLayout
    - NoUserMessage
    - ReferralUpdater
    - Sidebar
  - AddFunds
  - CustomFormField
  - DemoCard
  - Footer
  - Header
  - Hero
  - Members
  - UserCard
  - WithdrawBonus

  ## Daily Tasks

  - Code reduction - Done
  - Improve site performance - Done
  - User Can Select Buy Account Plan or Buy Services interchangeably - Done
  - Exchange rate conversion implementation - Done
  - Calculation of the rate - Done
  - Confirm amount on buy account
  - Adding percentage commission for the owner
  - Settings
    - Theme
    - Two factor authentication
    - Change password
    - Logout
  - Place order
