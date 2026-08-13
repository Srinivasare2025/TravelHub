import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useServiceContext } from '../../../../state/ServiceContext';
import { Breadcrumb } from '../Layout/Breadcrumb';
import { LoadingSpinner, EmptyState } from '../../../../shared/components';
import { IQuickLink } from '../../../../models';
import styles from './BookTravelPage.module.scss';

export const BookTravelPage: React.FC = () => {
  const { service } = useServiceContext();
  const [links, setLinks] = React.useState<IQuickLink[] | undefined>(undefined);

  React.useEffect(() => {
    service.getQuickLinks().then(setLinks).catch(() => setLinks([]));
    service.logEvent('PageView', '/book-travel').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!links) return <LoadingSpinner />;

  const booking = links.filter((l) => l.Category === 'Booking');

  return (
    <div>
      <Breadcrumb items={[{ label: 'Book Travel' }]} />
      <h1 className={styles.title}>Book Travel</h1>
      <p className={styles.sub}>Launch Concur to book flights, hotels and rental cars, or jump to a specific travel service.</p>

      <div className={styles.panel}>
        <h3>Book with Concur</h3>
        <div className={styles.tileGrid}>
          {(booking.length ? booking : links.slice(0, 3)).map((l) => (
            <a key={l.Id} className={styles.tileBig} href={l.URL.Url} target={l.OpenInNewTab ? '_blank' : undefined} rel="noopener noreferrer">
              <span className={styles.tileIconBig}><Icon iconName={l.IconClass || 'Airplane'} /></span>
              <span>{l.Title}</span>
            </a>
          ))}
        </div>
      </div>

      <h2 className={styles.sectionTitle}>All Travel Services</h2>
      {links.length === 0 ? <EmptyState message="No travel services configured yet." /> : (
        <div className={styles.tileGrid}>
          {links.map((l) => (
            <a key={l.Id} className={styles.tile} href={l.URL.Url} target={l.OpenInNewTab ? '_blank' : undefined} rel="noopener noreferrer">
              <span className={styles.tileIcon}><Icon iconName={l.IconClass || 'Airplane'} /></span>
              <span>{l.Title}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
