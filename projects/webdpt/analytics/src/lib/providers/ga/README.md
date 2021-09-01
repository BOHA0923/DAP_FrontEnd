<img 
    src="../../../assets/svg/ga.svg" 
    alt="google analytics logo"
    height="100px"
    width="200px" />

# Google Analytics
__homepage__: [google.com/analytics](https://www.google.com/analytics)  
__docs__: [developers.google.com/analytics/devguides/collection/analyticsjs/](https://developers.google.com/analytics/devguides/collection/analyticsjs/)  
__import__: `import { NgxAnalyticsGoogleAnalytics } from 'ngx-analytics/ga';`

## Setup
1. To setup Google Analytics add the folowing to main.ts

```ts
import {NgxAnalyticsGoogleAnalytics} from "ngx-analytics/ga";


if (environment.production) {
  // ...
  NgxAnalyticsGoogleAnalytics.prototype.createGaSession(environment.googleAnalytics);
}
```

2. you can add other environments if you want. In your environment.prod.ts add the configuration

```ts
export const environment = {
  production: true,
  // ...
  googleAnalytics: {
    domain: 'auto',
    trackingId: 'UA-XXXXXXXX-X' // replace with your Tracking Id
  }
};
```

for localhost environments replace 'auto' with 'none'

3. [Setup Angulartics](https://github.com/angulartics/ngx-analytics/tree/next#installation) using `NgxAnalyticsGoogleAnalytics`
