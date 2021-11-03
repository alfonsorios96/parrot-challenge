[![Netlify Status](https://api.netlify.com/api/v1/badges/dbc0820e-ceb5-408f-9c12-b620276b44f2/deploy-status)](https://app.netlify.com/sites/zen-albattani-b51b49/deploys)

# Parrot Challenge
> By Manuel Rios

- About it
- Install
- Deploy
- Packages
    - App (Backoffice)
    - Home Page
    - Login Page
    - Store (Redux)
    - Requester Manager (API Handler)

## About it

The parrot challenge is a React project in order to apply to the Sr frontend developer role in Parrot. The main technologies for the project are: React 17, Babel 7, Jest, Enzyme 3, WebPack 5, Redux 7, lerna...

Here are the instructions in order to install dependencies, config the project and deploy it.

## Install

The way to install all dependecies (for any package in the monorepo) is run the command `build` at the root of the monorepo. You can use npm or yarn instead. This command is running a `lerna bootstrap`. This is a crucial first step, because all packages are linked to each other.

## Deploy

For deploy the only condition is merge the changes in master branch. And automatically Netlify runs the deploy in ``https://zen-albattani-b51b49.netlify.app``

The conditions for this situation are configured:

| - | - |
| ------ | ------ | 
| Repository | github.com/alfonsorios96/parrot-challenge |
| Base directory | packages/parrot-backoffice |
| Build command | webpack |
| Publish directory | packages/parrot-backoffice/dist |

## Packages

The strategy was implementing Lerna for monorepository, so here are the packages for the monorepo:

### App (Backoffice)

The entire application is a single web page, and it's contained in `packages/parrot-backoffice`.

#### Running

Go to the path `<rootDir>/packages/parrot-backoffice` and exec command `start`. This command is running webpack-dev-sever with a standar configuration. The rules are in webpack.config.js file.

#### Testing

Go to the path `<rootDir>/packages/parrot-backoffice` and exec command `test`. This command is running jest with a standar configuration. The rules are in package.json file.

#### Styling

The styling is so easy to customize because has used SASS variables and CSS variables. And created a theme.scss file for that porpouse. You can find this file in `<rootDir>/packages/parrot-backoffice/src/theme.scss` There is the colors for the app.

If you are going to create a new page or component, you can use this same file to add more variables and also you can use the CSS variables to custom the values for more themes.

| SASS Variables | Value |
| ------ | ------ | 
| $parrot-color-1 | #F04E4A |
| $parrot-color-2 | #101010 |
| $parrot-color-3 | #FFFFFF |
| $parrot-color-4 | #333333 |
| $parrot-color-5 | #f2f2f2 |

| SASS Variables | CSS Variables |
| ------ | ------ | 
| $parrot-color-1 | --parrot-color-orange |
| $parrot-color-2 | --parrot-color-black |
| $parrot-color-3 | --parrot-color-white |
| $parrot-color-4 | --parrot-color-gray |
| $parrot-color-5 | --parrot-color-soft |

#### Routing

For the routes was implemented `react-router-dom`

| Route | Component |
| ------ | ------ | 
| /login | ParrotLogin |
| /home | ParrotHome |
| * | Redirect to ParrotLogin |

### Home Page

The home page contains the main dashboard, with the name store, categories and products. This is developed with an update logic for the availability of the products. The page is protected with Auth logic in the parent component (App) if is not session or is invalid, then redirect to Login page.

#### Running

Go to the path `<rootDir>/packages/parrot-home` and exec command `start`. This command is running webpack-dev-sever with a standar configuration. The rules are in webpack.config.js file.

### Login Page

The home page contains the main dashboard, with the name store, categories and products. This is developed with an update logic for the availability of the products.

#### Running

Go to the path `<rootDir>/packages/parrot-login` and exec command `start`. This command is running webpack-dev-sever with a standar configuration. The rules are in webpack.config.js file. The page is configured for detect in the first loaded if has a valid session redirect to Home page.

### Store (Redux)

The store is a module isolated with the logic for manage the states in the all application, this module was separed because the actions could be reusables across the pages, and components.

#### Testing

Go to the path `<rootDir>/packages/parrot-store` and exec command `test`. This command is running jest with a standar configuration. The rules are default and the test suites are contained in `/test` directory.

#### States

| State | Description | Reducers |
| ------ | ------ | ------ | 
| user | This state contains `access_token` and `refresh_token` and it's setted while login or logout | saveSession(`{access_token: '', refresh_token: ''}`, resetSession()) | 
| spinner | This state contains a boolean and it's setted while toggle the spinner visibility | toggleSpinner(`new value`) | 

### Requester Manager

This a API Handler based in fetch and developed enterily by me. The method `request` receive a configuration object and return a promise.

```js
const requester = new RequestManager(host || 'https://domain.com');

requester.request({
    endpoint: '/api/v2/service',    // The endpoint of the API service
    method: 'POST',                 // The HTTP method [GET by default]
    body: {},                       // Only if the method is POST, or PUT
    headers: {},                    // Headers for the request, by default always send Content-Type: application/json, but could be replace it.
    callbacks: [{status:500, action: () => {}}], // Array of objects for each http status response and action function to handler it. (Optional)
    before: () => {},               // Action to exec before the request was trigged
    after: () => {},                // Action to exec after the request was done
}).then(response => {
    // Handle response
}).catch(error => {
    // Handle error
});
```
