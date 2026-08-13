import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useServiceContext } from '../../../../../state/ServiceContext';
import { Breadcrumb } from '../../Layout/Breadcrumb';
import { LoadingSpinner, EmptyState } from '../../../../../shared/components';
import { IResourceItem } from '../../../../../models';
import styles from './TravelInfoChild.module.scss';

/**
 * Sample "Travel Info" dropdown child #1. Content is real and dynamic —
 * it's every Resource (Guide or Form) tagged Category === 'Visa', not
 * placeholder text — Admins manage what shows here the same way they
 * manage the main Resources list.
 */
export const VisaRequirementsPage: React.FC = () => {
  const { service } = useServiceContext();
  const [items, setItems] = React.useState<IResourceItem[] | undefined>(undefined);

  React.useEffect(() => {
    service.getAllResources().then((all) => setItems(all.filter((r) => r.Category === 'Visa'))).catch(() => setItems([]));
    service.logEvent('PageView', '/travel-info/visa-requirements').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!items) return <LoadingSpinner />;

  return (
    <div>
      <Breadcrumb items={[{ label: 'Travel Info', route: '/resources' }, { label: 'Visa Requirements' }]} />
      <h1 className={styles.title}>Visa Requirements</h1>
      <p className={styles.sub}>Country-specific visa checklists and guidance, pulled from Travel Resources tagged &ldquo;Visa&rdquo;.</p>
      {items.length === 0 ? <EmptyState message="No visa-related resources published yet." icon="ContactCard" /> : (
        <div className={styles.list}>
          {items.map((r) => (
            <a key={`${r.ResourceType}-${r.Id}`} className={styles.row} href={r.FileRef}>
              <Icon iconName={r.ResourceType === 'Form' ? 'DocumentSet' : 'ReadingMode'} />
              <div><strong>{r.Title}</strong><span>{r.Summary}</span></div>
              <Icon iconName="Download" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
