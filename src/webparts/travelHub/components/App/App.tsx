import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { initializeIcons } from '@fluentui/react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ServiceProvider } from '../../../../state/ServiceContext';
import { ThemeContextProvider } from '../../../../state/ThemeContext';
import { UserContextProvider } from '../../../../state/UserContext';
import { Layout } from '../Layout/Layout';
import {
  HomePage, BookTravelPage, PoliciesPage, PolicyDetailPage, ResourcesPage,
  FaqsPage, PromotionsPage, NewsPage, VisaRequirementsPage, HealthSafetyPage, TravelGuidesPage
} from '../pages';

initializeIcons();

export interface IAppProps {
  context: WebPartContext;
}

/**
 * Deliberately ONE SPFx web part rendering a client-routed SPA (HashRouter)
 * across every public page, rather than nine separate web parts/pages —
 * simpler to deploy (add once to one modern page), and every page still
 * gets its own component under components/pages/ + its own route + its own
 * breadcrumb, so the "each page is one component" structure is intact.
 * See docs/ARCHITECTURE.md for how to add a 10th page.
 */
export const App: React.FC<IAppProps> = ({ context }) => (
  <ServiceProvider context={context}>
    <ThemeContextProvider>
      <UserContextProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/book-travel" element={<BookTravelPage />} />
              <Route path="/policies" element={<PoliciesPage />} />
              <Route path="/policies/:id" element={<PolicyDetailPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/faqs" element={<FaqsPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/travel-info/visa-requirements" element={<VisaRequirementsPage />} />
              <Route path="/travel-info/health-safety" element={<HealthSafetyPage />} />
              <Route path="/travel-info/travel-guides" element={<TravelGuidesPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </UserContextProvider>
    </ThemeContextProvider>
  </ServiceProvider>
);
