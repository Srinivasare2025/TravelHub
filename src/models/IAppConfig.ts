import { ThemeKey } from './ITheme';

/** The list name mapping — lets an org rename a list without a code change. */
export interface IListNameConfig {
  policies: string;
  guides: string;
  forms: string;
  faqs: string;
  promotions: string;
  news: string;
  quickLinks: string;
  pageViews: string;
}

export const DEFAULT_LIST_NAMES: IListNameConfig = {
  policies: 'TravelPolicies',
  guides: 'TravelGuides',
  forms: 'TravelForms',
  faqs: 'TravelFAQs',
  promotions: 'TravelPromotions',
  news: 'TravelNews',
  quickLinks: 'TravelQuickLinks',
  pageViews: 'TravelHubPageViews'
};

export interface IGroupNameConfig {
  admins: string;
  contributors: string;
  visitors: string;
}

export const DEFAULT_GROUP_NAMES: IGroupNameConfig = {
  admins: 'Travel Hub Admins',
  contributors: 'Travel Hub Contributors',
  visitors: 'Travel Hub Visitors'
};

/**
 * Everything an Admin can change at runtime from Admin > Settings, stored
 * as key/value rows in the TravelHubConfig list (see ConfigService) rather
 * than hard-coded — this is what satisfies "provision for admin to
 * configure site URL, lists and other dependency configuration".
 *
 * `sitesUrl` is optional: when the Travel Hub lists live in a different
 * site than the one the web part is placed on (e.g. web part on the main
 * intranet homepage, lists in a dedicated /sites/TravelHub site), set it
 * here. Leaving it blank uses the current site.
 */
export interface IAppConfig {
  siteUrl: string; // '' = use the current site the web part is hosted on
  lists: IListNameConfig;
  groups: IGroupNameConfig;
  uploadsFolderUrl: string; // server-relative, e.g. /sites/TravelHub/SiteAssets/travelhub/uploads
  heroImageUrl: string; // default Home hero background, overridable
  defaultTheme: ThemeKey;
  organizationName: string;
}

export const DEFAULT_APP_CONFIG: IAppConfig = {
  siteUrl: '',
  lists: DEFAULT_LIST_NAMES,
  groups: DEFAULT_GROUP_NAMES,
  uploadsFolderUrl: '',
  heroImageUrl: '',
  defaultTheme: 'goldNavy',
  organizationName: 'Travel Hub'
};

/**
 * Result of checking, at app load, whether the SharePoint dependencies this
 * app needs (the `TravelHubConfig` list itself, plus the content lists it
 * points at) actually exist at the resolved site. `undefined` everywhere
 * this is used means "fully provisioned, nothing to warn about" — see
 * ServiceContext, which computes this once and shares it via ConfigWarningBanner
 * so a first-run/mis-configured site tells the admin exactly what to fix
 * instead of silently rendering blank sections.
 */
export interface IConfigValidationResult {
  /** The site the app actually resolved to use (config.siteUrl if set, else the current site). */
  siteUrl: string;
  /** False when the TravelHubConfig list wasn't found at siteUrl — defaults are being used instead. */
  configListFound: boolean;
  /** Content list titles (from config.lists) that don't exist at siteUrl. Empty when fully provisioned. */
  missingLists: string[];
}
