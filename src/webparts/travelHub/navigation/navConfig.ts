export interface INavChildItem {
  key: string;
  label: string;
  route: string;
}

export interface INavItem {
  key: string;
  label: string;
  route?: string;
  children?: INavChildItem[];
}

/**
 * The primary nav, including the "Travel Info" dropdown's sample child
 * pages. Each child routes to its own component under
 * components/pages/TravelInfoChildPages/ — real content, not placeholder
 * text, each pulling from the appropriate list/filter (see those files).
 * To add a 4th dropdown child: add a route here + a component + a <Route>
 * entry in App.tsx — that's the whole extension surface, documented in
 * docs/ARCHITECTURE.md.
 */
export const NAV_ITEMS: INavItem[] = [
  { key: 'home', label: 'Home', route: '/' },
  { key: 'book-travel', label: 'Book Travel', route: '/book-travel' },
  {
    key: 'travel-info',
    label: 'Travel Info',
    children: [
      { key: 'visa-requirements', label: 'Visa Requirements', route: '/travel-info/visa-requirements' },
      { key: 'health-safety', label: 'Health & Safety', route: '/travel-info/health-safety' },
      { key: 'travel-guides', label: 'Travel Guides', route: '/travel-info/travel-guides' }
    ]
  },
  { key: 'policies', label: 'Policies & Guidelines', route: '/policies' },
  { key: 'resources', label: 'Resources', route: '/resources' },
  { key: 'promotions', label: 'Promotions & Events', route: '/promotions' },
  { key: 'faqs', label: 'FAQs', route: '/faqs' },
  { key: 'news', label: 'News & Updates', route: '/news' }
];
