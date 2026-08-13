import {
  IPolicy,
  IForm,
  IFaq,
  IPromotion,
  INewsItem,
  IQuickLink,
  IResourceItem,
  ISharePointUser,
  IAnalyticsPoint,
  IPendingApprovalItem,
  INotification,
  ISearchResultItem,
  IMediaFile,
  PageViewEventType
} from '../models';

/**
 * Every data operation used anywhere in the solution, real (SharePointService)
 * or mock (MockSharePointService, workbench-only). Keeping this as one
 * interface is what lets ServiceFactory swap implementations transparently —
 * components only ever depend on ISharePointService, never on which one.
 */
export interface ISharePointService {
  // ---- Public read paths ----
  getActivePromotions(top?: number): Promise<IPromotion[]>;
  getAllPromotions(): Promise<IPromotion[]>;
  getQuickLinks(): Promise<IQuickLink[]>;
  getFeaturedNews(top?: number): Promise<INewsItem[]>;
  getPublishedFaqs(): Promise<IFaq[]>;
  getPolicies(category?: string): Promise<IPolicy[]>;
  getPolicyById(id: number): Promise<IPolicy>;
  getRelatedFormsByCategory(formCategory: string): Promise<IForm[]>;
  getRelatedPolicies(category: string, excludeId: number): Promise<IPolicy[]>;
  getAllResources(): Promise<IResourceItem[]>;
  getCurrentUser(): Promise<ISharePointUser>;
  getCurrentUserGroups(): Promise<string[]>;
  getRecentNotifications(): Promise<INotification[]>;
  logEvent(eventType: PageViewEventType, itemReference: string): Promise<void>;
  search(term: string): Promise<ISearchResultItem[]>;

  // ---- Generic admin CRUD ----
  getAllItems<T>(listName: string, query?: string): Promise<T[]>;
  createItem<T>(listName: string, fields: Record<string, unknown>): Promise<T>;
  updateItem(listName: string, id: number, fields: Record<string, unknown>): Promise<void>;
  deleteItem(listName: string, id: number): Promise<void>;
  setModerationStatus(listName: string, id: number, status: number, comment?: string): Promise<void>;
  uploadFileToLibrary(listName: string, file: File, fields: Record<string, unknown>): Promise<number>;
  uploadImageAsset(file: File): Promise<string>;
  resolveUser(loginOrEmail: string): Promise<number>;

  // ---- Admin dashboard aggregates ----
  getListItemCount(listName: string): Promise<number>;
  getRecentItemCount(listName: string, days: number): Promise<number>;
  getGroupUserCount(groupName: string): Promise<number>;
  getGroupMembers(groupName: string): Promise<ISharePointUser[]>;
  getPendingApprovals(): Promise<IPendingApprovalItem[]>;
  getPageViewAnalytics(rangeDays: number): Promise<IAnalyticsPoint[]>;
  getMediaLibraryFiles(): Promise<IMediaFile[]>;
  deleteMediaFile(serverRelativeUrl: string): Promise<void>;

  // ---- Config (TravelHubConfig list) ----
  getConfigRows(): Promise<Record<string, string>>;
  saveConfigRows(rows: Record<string, string>): Promise<void>;

  // ---- Dependency validation (drives the ConfigWarningBanner) ----
  /** Returns the subset of `listTitles` that do NOT exist at the resolved site — empty when all are provisioned. */
  checkListsExist(listTitles: string[]): Promise<string[]>;

  // ---- Native SharePoint links (Settings page "open in SharePoint") ----
  getListWebRelativeUrl(listName: string): string;
}
