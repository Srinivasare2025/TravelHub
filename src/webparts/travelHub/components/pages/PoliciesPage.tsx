import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { Breadcrumb } from '../Layout/Breadcrumb';
import { LoadingSpinner } from '../../../../shared/components';
import { IPolicy } from '../../../../models';
import styles from './PoliciesPage.module.scss';

export const PoliciesPage: React.FC = () => {
  const { service } = useServiceContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [policies, setPolicies] = React.useState<IPolicy[] | undefined>(undefined);
  const [category, setCategory] = React.useState(searchParams.get('category') || '');
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    service.getPolicies().then(setPolicies).catch(() => setPolicies([]));
    service.logEvent('PageView', '/policies').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!policies) return <LoadingSpinner />;

  const categories = Array.from(new Set(policies.map((p) => p.PolicyCategory))).sort();
  const filtered = policies.filter((p) => (!category || p.PolicyCategory === category) && (!search || p.Title.toLowerCase().indexOf(search.toLowerCase()) !== -1));

  return (
    <div>
      <Breadcrumb items={[{ label: 'Travel Policies' }]} />
      <div className={styles.pageHeaderRow}>
        <div>
          <h1 className={styles.title}>Travel Policies</h1>
          <p className={styles.sub}>Company travel policies and procedures</p>
        </div>
        <div className={styles.searchWrap}>
          <input type="text" placeholder="Search policies..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Icon iconName="Search" />
        </div>
      </div>

      <div className={styles.sidebarLayout}>
        <div className={styles.sidebarFilter}>
          <div className={styles.filterHeading}>Categories</div>
          <button className={!category ? styles.filterActive : undefined} onClick={() => setCategory('')}>All Policies</button>
          {categories.map((c) => (
            <button key={c} className={category === c ? styles.filterActive : undefined} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Policy Title</th><th>Category</th><th>Last Modified</th><th /></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={4} className={styles.tableEmpty}>No policies match your filters.</td></tr>}
              {filtered.map((p) => (
                <tr key={p.Id}>
                  <td><a className={styles.rowTitle} onClick={() => navigate(`/policies/${p.Id}`)}>{p.Title}</a></td>
                  <td>{p.PolicyCategory}</td>
                  <td>{new Date(p.Modified).toLocaleDateString()}</td>
                  <td><a href={p.FileRef} title="Download"><Icon iconName="Download" /></a></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.tableFooter}>Showing 1 to {filtered.length} of {filtered.length} policies</div>
        </div>
      </div>
    </div>
  );
};
