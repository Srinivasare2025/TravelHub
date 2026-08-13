import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useSearchParams } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { Breadcrumb } from '../Layout/Breadcrumb';
import { LoadingSpinner, Pagination } from '../../../../shared/components';
import { IResourceItem } from '../../../../models';
import styles from './ResourcesPage.module.scss';

const PAGE_SIZE = 8;

export const ResourcesPage: React.FC = () => {
  const { service } = useServiceContext();
  const [searchParams] = useSearchParams();
  const [all, setAll] = React.useState<IResourceItem[] | undefined>(undefined);
  const [category, setCategory] = React.useState(searchParams.get('category') || '');
  const [type, setType] = React.useState(searchParams.get('type') || '');
  const [search, setSearch] = React.useState('');
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    service.getAllResources().then(setAll).catch(() => setAll([]));
    service.logEvent('PageView', '/resources').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!all) return <LoadingSpinner />;

  const categories = Array.from(new Set(all.map((r) => r.Category))).sort();
  const filtered = all.filter((r) =>
    (!category || r.Category === category) &&
    (!type || r.ResourceType === type) &&
    (!search || r.Title.toLowerCase().indexOf(search.toLowerCase()) !== -1)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const iconFor = (r: IResourceItem): string => (r.ResourceType === 'Form' ? 'DocumentSet' : 'ReadingMode');

  return (
    <div>
      <Breadcrumb items={[{ label: 'Travel Resources' }]} />
      <h1 className={styles.title}>Travel Resources</h1>
      <p className={styles.sub}>Guides, forms and helpful documents</p>

      <div className={styles.filterBar}>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
          <option value="">All Types</option>
          <option value="Guide">Guide</option>
          <option value="Form">Form</option>
        </select>
        <div className={styles.searchWrap}>
          <input type="text" placeholder="Search resources..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <Icon iconName="Search" />
        </div>
        <div className={styles.viewToggle}>
          <button className={view === 'grid' ? styles.toggleActive : undefined} onClick={() => setView('grid')}><Icon iconName="GridViewMedium" /></button>
          <button className={view === 'list' ? styles.toggleActive : undefined} onClick={() => setView('list')}><Icon iconName="BulletedList" /></button>
        </div>
      </div>

      {pageItems.length === 0 ? (
        <p className={styles.empty}>No resources match your filters.</p>
      ) : view === 'grid' ? (
        <div className={styles.cardGrid}>
          {pageItems.map((r) => (
            <div key={`${r.ResourceType}-${r.Id}`} className={styles.card}>
              <h4><Icon iconName={iconFor(r)} /> {r.Title}</h4>
              <p>{r.Summary}</p>
              <div className={styles.cardMeta}>
                <span className={styles.pill}>{r.Category}</span>
                <a href={r.FileRef}><Icon iconName="Download" /> Download</a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.resourceList}>
          {pageItems.map((r) => (
            <a key={`${r.ResourceType}-${r.Id}`} className={styles.resourceRow} href={r.FileRef}>
              <span className={styles.rowIcon}><Icon iconName={iconFor(r)} /></span>
              <div className={styles.rowBody}><h4>{r.Title}</h4><p>{r.Summary}</p></div>
              <div className={styles.rowMeta}><span className={styles.pill}>{r.Category}</span><br />{new Date(r.Modified).toLocaleDateString()}</div>
            </a>
          ))}
        </div>
      )}

      <Pagination page={currentPage} pageSize={PAGE_SIZE} totalCount={filtered.length} onPageChange={setPage} itemLabel="resources" />
    </div>
  );
};
