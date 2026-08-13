import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../../state/ServiceContext';
import { Breadcrumb } from '../../Layout/Breadcrumb';
import { LoadingSpinner, EmptyState } from '../../../../../shared/components';
import { IPolicy } from '../../../../../models';
import styles from './TravelInfoChild.module.scss';

/** Sample "Travel Info" dropdown child #2 — approved Policies tagged Category === 'Health & Safety'. */
export const HealthSafetyPage: React.FC = () => {
  const { service } = useServiceContext();
  const navigate = useNavigate();
  const [items, setItems] = React.useState<IPolicy[] | undefined>(undefined);

  React.useEffect(() => {
    service.getPolicies('Health & Safety').then(setItems).catch(() => setItems([]));
    service.logEvent('PageView', '/travel-info/health-safety').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!items) return <LoadingSpinner />;

  return (
    <div>
      <Breadcrumb items={[{ label: 'Travel Info', route: '/policies' }, { label: 'Health & Safety' }]} />
      <h1 className={styles.title}>Health & Safety</h1>
      <p className={styles.sub}>Safety briefings, insurance requirements and emergency guidance for international travel.</p>
      {items.length === 0 ? <EmptyState message="No health & safety policies published yet." icon="Health" /> : (
        <div className={styles.list}>
          {items.map((p) => (
            <a key={p.Id} className={styles.row} onClick={() => navigate(`/policies/${p.Id}`)}>
              <Icon iconName="Shield" />
              <div><strong>{p.Title}</strong><span>{p.Summary}</span></div>
              <Icon iconName="ChevronRight" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
