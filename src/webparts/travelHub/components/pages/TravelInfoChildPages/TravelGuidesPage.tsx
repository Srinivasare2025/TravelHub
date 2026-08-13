import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useServiceContext } from '../../../../../state/ServiceContext';
import { Breadcrumb } from '../../Layout/Breadcrumb';
import { LoadingSpinner, EmptyState } from '../../../../../shared/components';
import { IResourceItem } from '../../../../../models';
import styles from './TravelInfoChild.module.scss';

/** Sample "Travel Info" dropdown child #3 — every Resource with ResourceType === 'Guide'. */
export const TravelGuidesPage: React.FC = () => {
  const { service } = useServiceContext();
  const [items, setItems] = React.useState<IResourceItem[] | undefined>(undefined);

  React.useEffect(() => {
    service.getAllResources().then((all) => setItems(all.filter((r) => r.ResourceType === 'Guide'))).catch(() => setItems([]));
    service.logEvent('PageView', '/travel-info/travel-guides').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!items) return <LoadingSpinner />;

  return (
    <div>
      <Breadcrumb items={[{ label: 'Travel Info', route: '/resources' }, { label: 'Travel Guides' }]} />
      <h1 className={styles.title}>Travel Guides</h1>
      <p className={styles.sub}>Step-by-step how-tos for booking, expenses and more.</p>
      {items.length === 0 ? <EmptyState message="No guides published yet." icon="ReadingMode" /> : (
        <div className={styles.list}>
          {items.map((r) => (
            <a key={r.Id} className={styles.row} href={r.FileRef}>
              <Icon iconName="ReadingMode" />
              <div><strong>{r.Title}</strong><span>{r.Summary}</span></div>
              <Icon iconName="Download" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
