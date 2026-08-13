import { IPolicy, IGuide, IForm, IFaq, IPromotion, INewsItem, IQuickLink, ModerationStatus, IPageViewEvent } from '../../models';

/** Seed dates relative to "now" so the mock never silently goes stale. */
function daysFromNow(n: number): string {
  return new Date(Date.now() + n * 86400000).toISOString();
}

export interface IMockStore {
  TravelPolicies: IPolicy[];
  TravelGuides: IGuide[];
  TravelForms: IForm[];
  TravelFAQs: IFaq[];
  TravelPromotions: IPromotion[];
  TravelNews: INewsItem[];
  TravelQuickLinks: IQuickLink[];
  TravelHubPageViews: IPageViewEvent[];
  [key: string]: unknown[];
}

export function createMockStore(): IMockStore {
  const store: IMockStore = {
    TravelPolicies: [
      {
        Id: 1, Title: 'Global Travel & Expense Policy', PolicyCategory: 'General', Region: 'Global',
        EffectiveDate: '2026-01-01', PolicyVersion: '3.2',
        Summary: 'The master policy covering booking classes, per-diem and approvals.',
        PolicyBody: '<h3>1. Purpose</h3><p>Outlines guidelines for all business travel.</p><h3>2. Scope</h3><p>Applies to all employees, contractors and consultants.</p>',
        IsFeatured: true, FileRef: '#', FileLeafRef: 'General-Travel-Policy.pdf', Modified: '2026-05-15',
        OData__ModerationStatus: ModerationStatus.Approved, ReviewedBy: { Title: 'Sarah Ahmed' }
      },
      {
        Id: 2, Title: 'Expense Policy', PolicyCategory: 'Expense', Region: 'Global', EffectiveDate: '2026-01-10',
        PolicyVersion: '2.0', Summary: 'Rules for claiming and approving travel expenses.',
        PolicyBody: '<h3>1. Purpose</h3><p>Defines reimbursable expenses and the approval workflow.</p>',
        IsFeatured: false, FileRef: '#', FileLeafRef: 'Expense-Policy.pdf', Modified: '2026-05-10',
        OData__ModerationStatus: ModerationStatus.Approved
      },
      {
        Id: 3, Title: 'Visa Policy', PolicyCategory: 'Visa', Region: 'Global', EffectiveDate: '2026-02-01',
        PolicyVersion: '1.4', Summary: 'When the company sponsors visa applications and how to request it.',
        PolicyBody: '<h3>1. Purpose</h3><p>Clarifies visa sponsorship eligibility for international travel.</p>',
        IsFeatured: false, FileRef: '#', FileLeafRef: 'Visa-Policy.pdf', Modified: '2026-05-08',
        OData__ModerationStatus: ModerationStatus.Approved
      },
      {
        Id: 4, Title: 'Booking Guidelines', PolicyCategory: 'Booking', Region: 'Global', EffectiveDate: '2026-01-05',
        PolicyVersion: '1.1', Summary: 'Preferred booking classes and lead-time requirements.',
        PolicyBody: '<h3>1. Purpose</h3><p>Sets booking class and lead-time expectations.</p>',
        IsFeatured: false, FileRef: '#', FileLeafRef: 'Booking-Guidelines.pdf', Modified: '2026-05-05',
        OData__ModerationStatus: ModerationStatus.Approved
      },
      {
        Id: 5, Title: 'Health & Safety Policy', PolicyCategory: 'Health & Safety', Region: 'Global', EffectiveDate: '2026-02-15',
        PolicyVersion: '1.0', Summary: 'Mandatory safety briefings and insurance requirements for travel abroad.',
        PolicyBody: '<h3>1. Purpose</h3><p>Mandatory safety briefings for international travel.</p>',
        IsFeatured: false, FileRef: '#', FileLeafRef: 'Health-Safety-Policy.pdf', Modified: daysFromNow(-5),
        OData__ModerationStatus: ModerationStatus.Pending
      },
      {
        Id: 6, Title: 'Sustainability Guidelines', PolicyCategory: 'Sustainability', Region: 'Global', EffectiveDate: '2026-03-01',
        PolicyVersion: '1.0', Summary: 'Preferring lower-carbon travel options where practical.',
        PolicyBody: '<h3>1. Purpose</h3><p>Encourages lower-carbon travel choices where practical.</p>',
        IsFeatured: false, FileRef: '#', FileLeafRef: 'Sustainability-Guidelines.pdf', Modified: '2026-04-28',
        OData__ModerationStatus: ModerationStatus.Draft
      }
    ],
    TravelGuides: [
      {
        Id: 1, Title: 'Travel Guide - Flights', GuideType: 'Concur Booking', AudienceRole: { results: ['Employee'] },
        Summary: 'Step-by-step walkthrough for booking flights in Concur.', IsFeatured: true, PublishDate: '2026-05-01',
        FileRef: '#', FileLeafRef: 'Guide-Flights.pdf', Modified: '2026-05-01', OData__ModerationStatus: ModerationStatus.Approved
      },
      {
        Id: 2, Title: 'Travel Guide - Hotels', GuideType: 'Concur Booking', AudienceRole: { results: ['Employee'] },
        Summary: 'How to search and book hotels within policy.', IsFeatured: true, PublishDate: '2026-04-20',
        FileRef: '#', FileLeafRef: 'Guide-Hotels.pdf', Modified: '2026-04-20', OData__ModerationStatus: ModerationStatus.Approved
      },
      {
        Id: 3, Title: 'Visa Requirements Guide', GuideType: 'Visa Process', AudienceRole: { results: ['Employee', 'Manager'] },
        Summary: 'Country-specific visa requirement checklists.', IsFeatured: false, PublishDate: '2026-04-10',
        FileRef: '#', FileLeafRef: 'Guide-Visa.pdf', Modified: daysFromNow(-2), OData__ModerationStatus: ModerationStatus.Approved
      }
    ],
    TravelForms: [
      { Id: 1, Title: 'Travel Request Form', FormCategory: 'Booking Exception', Region: 'Global', Instructions: 'Use for booking exceptions.', FileRef: '#', FileLeafRef: 'Travel-Request-Form.docx', Modified: '2026-05-01' },
      { Id: 2, Title: 'Expense Claim Form', FormCategory: 'Expense', Region: 'Global', Instructions: 'Submit within 10 business days.', FileRef: '#', FileLeafRef: 'Expense-Claim-Form.docx', Modified: '2026-04-15' },
      { Id: 3, Title: 'Visa Requirements Guide', FormCategory: 'Visa', Region: 'Global', Instructions: 'Checklist per country.', FileRef: '#', FileLeafRef: 'Visa-Requirements.pdf', Modified: '2026-04-01' },
      { Id: 4, Title: 'Packing Checklist', FormCategory: 'Other', Region: 'Global', Instructions: 'Optional packing checklist.', FileRef: '#', FileLeafRef: 'Packing-Checklist.pdf', Modified: '2026-03-20' },
      { Id: 5, Title: 'Per Diem Rates', FormCategory: 'Expense', Region: 'Global', Instructions: 'Current per-diem table.', FileRef: '#', FileLeafRef: 'Per-Diem-Rates.xlsx', Modified: '2026-03-10' },
      { Id: 6, Title: 'Travel Insurance Info', FormCategory: 'Other', Region: 'Global', Instructions: 'Corporate insurance summary.', FileRef: '#', FileLeafRef: 'Travel-Insurance-Info.pdf', Modified: '2026-02-28' }
    ],
    TravelFAQs: [
      { Id: 1, Title: 'How do I book a flight through Concur?', Answer: 'Go to Book Travel &gt; Book with Concur, sign in with SSO, and search your itinerary.', Category: 'Booking', SortOrder: 1, IsPublished: true },
      { Id: 2, Title: 'What is the baggage allowance for business travel?', Answer: "Baggage allowance follows the airline's standard fare rules.", Category: 'Booking', SortOrder: 2, IsPublished: true },
      { Id: 3, Title: 'How do I claim my travel expenses?', Answer: 'Submit the Expense Claim Form within 10 business days.', Category: 'Expense', SortOrder: 1, IsPublished: true },
      { Id: 4, Title: 'How long does it take to get visa approval?', Answer: 'Typically 5-10 business days depending on destination.', Category: 'Visa', SortOrder: 1, IsPublished: true },
      { Id: 5, Title: 'What should I do in case of a travel emergency?', Answer: 'Call the 24/7 travel emergency line and notify your manager.', Category: 'Other', SortOrder: 1, IsPublished: true },
      { Id: 6, Title: 'Can I extend a business trip for personal travel?', Answer: 'Yes, with manager approval.', Category: 'Travel Policy', SortOrder: 1, IsPublished: true },
      { Id: 7, Title: 'Draft: refund policy for cancelled trips', Answer: 'Not yet finalized.', Category: 'Other', SortOrder: 2, IsPublished: false }
    ],
    TravelPromotions: [
      { Id: 1, Title: '25% Off on Select Hotels', Description: 'Book within the next 30 days.', BannerType: 'Limited Time', StartDate: daysFromNow(-10), EndDate: daysFromNow(30), Priority: 1, IsActive: true, Modified: daysFromNow(-10) },
      { Id: 2, Title: 'Save on Business Flights', Description: 'Up to 15% off on international bookings.', BannerType: 'Exclusive', StartDate: daysFromNow(-5), EndDate: daysFromNow(45), Priority: 2, IsActive: true, Modified: daysFromNow(-5) },
      { Id: 3, Title: 'Travel Awareness Webinar', Description: 'Live webinar — register now.', BannerType: 'Upcoming Event', StartDate: daysFromNow(7), EndDate: daysFromNow(7), Priority: 3, IsActive: true, Modified: '2026-04-01' }
    ],
    TravelNews: [
      { Id: 1, Title: 'New Corporate Hotel Program Launched', Summary: 'Preferred hotel rates now live across 12 destinations.', Body: 'Full article body...', Category: 'News', PublishDate: '2026-05-15', IsFeatured: true, Modified: '2026-05-15' },
      { Id: 2, Title: 'Travel Policy Updates', Summary: 'Policy changes effective from June 2026.', Body: 'Full article body...', Category: 'Update', PublishDate: '2026-05-10', IsFeatured: false, Modified: '2026-05-10' },
      { Id: 3, Title: 'Sustainability in Travel', Summary: 'Our commitment to green travel.', Body: 'Full article body...', Category: 'News', PublishDate: '2026-05-08', IsFeatured: false, Modified: '2026-05-08' },
      { Id: 4, Title: 'Top Destinations for 2026', Summary: 'Explore trending business travel destinations.', Body: 'Full article body...', Category: 'Update', PublishDate: '2026-05-05', IsFeatured: false, Modified: '2026-05-05' }
    ],
    TravelQuickLinks: [
      { Id: 1, Title: 'Book Flight', URL: { Url: '#' }, IconClass: 'Airplane', Category: 'Booking', SortOrder: 1, OpenInNewTab: true },
      { Id: 2, Title: 'Book Hotel', URL: { Url: '#' }, IconClass: 'CityNext', Category: 'Booking', SortOrder: 2, OpenInNewTab: true },
      { Id: 3, Title: 'Rental Car', URL: { Url: '#' }, IconClass: 'Car', Category: 'Booking', SortOrder: 3, OpenInNewTab: true },
      { Id: 4, Title: 'Travel Policies', URL: { Url: '#/policies' }, IconClass: 'Shield', Category: 'Policy', SortOrder: 4, OpenInNewTab: false },
      { Id: 5, Title: 'User Guides', URL: { Url: '#/resources?type=Guide' }, IconClass: 'ReadingMode', Category: 'Support', SortOrder: 5, OpenInNewTab: false },
      { Id: 6, Title: 'Travel Forms', URL: { Url: '#/resources?type=Form' }, IconClass: 'DocumentSet', Category: 'Support', SortOrder: 6, OpenInNewTab: false },
      { Id: 7, Title: 'FAQs', URL: { Url: '#/faqs' }, IconClass: 'Help', Category: 'Support', SortOrder: 7, OpenInNewTab: false }
    ],
    TravelHubPageViews: []
  };

  // Seed ~60 days of page-view activity for the analytics chart / top-content table.
  const users = ['sandeep', 'fatima.ali', 'tom.becker', 'john.doe', 'priya.singh'];
  const refs = ['/home', '/policies', '/resources', '/faqs', '/promotions'];
  for (let d = 59; d >= 0; d--) {
    const date = new Date(Date.now() - d * 86400000);
    const count = 3 + Math.round(Math.random() * 10) + (date.getDay() === 0 || date.getDay() === 6 ? -2 : 0);
    for (let i = 0; i < Math.max(1, count); i++) {
      store.TravelHubPageViews.push({
        Title: `PageView-${date.toISOString()}`,
        EventDateTime: new Date(date.getTime() + i * 60000).toISOString(),
        UserLoginName: users[Math.floor(Math.random() * users.length)],
        EventType: 'PageView',
        ItemReference: refs[Math.floor(Math.random() * refs.length)]
      });
    }
  }

  return store;
}

export const mockGroupMembers: Record<string, { Id: number; Title: string; Email: string; LoginName: string }[]> = {
  'Travel Hub Admins': [
    { Id: 1, Title: 'Sarah Ahmed', Email: 'sarah.ahmed@example.com', LoginName: 'sarah.ahmed' },
    { Id: 2, Title: 'Omar Khalid', Email: 'omar.khalid@example.com', LoginName: 'omar.khalid' }
  ],
  'Travel Hub Contributors': [
    { Id: 3, Title: 'John Doe', Email: 'john.doe@example.com', LoginName: 'john.doe' },
    { Id: 4, Title: 'Priya Singh', Email: 'priya.singh@example.com', LoginName: 'priya.singh' },
    { Id: 5, Title: 'Ahmed Nasser', Email: 'ahmed.nasser@example.com', LoginName: 'ahmed.nasser' }
  ],
  'Travel Hub Visitors': [
    { Id: 6, Title: 'Sandeep Kumar', Email: 'sandeep@example.com', LoginName: 'sandeep' },
    { Id: 7, Title: 'Fatima Ali', Email: 'fatima.ali@example.com', LoginName: 'fatima.ali' }
  ]
};
