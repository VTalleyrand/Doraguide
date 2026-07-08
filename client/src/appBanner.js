import { appStoreAppId, siteUrl } from './metadata.js';

export const getSmartAppBannerAppArgument = (canonicalPath = '/') =>
  canonicalPath === '/' ? siteUrl : `${siteUrl}${canonicalPath}`;

export const getSmartAppBannerContent = (appArgument) =>
  `app-id=${appStoreAppId}, app-argument=${appArgument}`;

export const getSmartAppBannerTag = (appArgument) =>
  `<meta name="apple-itunes-app" content="${getSmartAppBannerContent(appArgument)}" />`;
