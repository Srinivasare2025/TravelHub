import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useServiceContext } from '../../../../state/ServiceContext';
import { useThemeContext } from '../../../../state/ThemeContext';
import { Breadcrumb } from '../Layout/Breadcrumb';
import { LoadingSpinner, ContentCard } from '../../../../shared/components';
import { cardPlaceholderImage } from '../../../../assets/images';
import { IPromotion, BannerType } from '../../../../models';
import styles from './PromotionsPage.module.scss';

const TYPES: (BannerType | '')[] = ['', 'Limited Time', 'Exclusive', 'Upcoming Event', 'Announcement'];

function ribbonVariant(type: BannerType): 'limited' | 'exclusive' | 'event' | 'announcement' {
  if (type === 'Limited Time') return 'limited';
  if (type === 'Exclusive') return 'exclusive';
  if (type === 'Upcoming Event') return 'event';
  return 'announcement';
}
function sampleVariant(type: BannerType): 'promo' | 'exclusive' | 'upcoming' | 'announcement' {
  if (type === 'Limited Time') return 'promo';
  if (type === 'Exclusive') return 'exclusive';
  if (type === 'Upcoming Event') return 'upcoming';
  return 'announcement';
}

export const PromotionsPage: React.FC = () => {
  const { service } = useServiceContext();
  const { theme } = useThemeContext();
  const [all, setAll] = React.useState<IPromotion[] | undefined>(undefined);
  const [filter, setFilter] = React.useState<BannerType | ''>('');

  React.useEffect(() => {
    service.getAllPromotions().then(setAll).catch(() => setAll([]));
    service.logEvent('PageView', '/promotions').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!all) return <LoadingSpinner />;
  const items = filter ? all.filter((p) => p.BannerType === filter) : all;

  return (
    <div>
      <Breadcrumb items={[{ label: 'Promotions & Events' }]} />
      <h1 className={styles.title}>Promotions & Events</h1>
      <p className={styles.sub}>Check out latest travel promotions and upcoming events</p>

      <div className={styles.tabs}>
        {TYPES.map((t) => (
          <span key={t || 'all'} className={filter === t ? styles.tabActive : styles.tab} onClick={() => setFilter(t)}>{t || 'All'}</span>
        ))}
      </div>

      {items.length === 0 ? <p className={styles.empty}>No promotions match this filter.</p> : (
        <div className={styles.cardGrid}>
          {items.map((p) => (
            <ContentCard
              key={p.Id}
              title={p.Title}
              summary={p.Description}
              imageUrl={p.BannerImage?.Url || cardPlaceholderImage(theme.palette.primary, theme.palette.secondary, sampleVariant(p.BannerType))}
              ribbonLabel={p.BannerType}
              ribbonVariant={ribbonVariant(p.BannerType)}
              metaRight={<span>{new Date(p.StartDate).toLocaleDateString()} &ndash; {new Date(p.EndDate).toLocaleDateString()}</span>}
              footer={
                <a className={styles.cta} href={p.LinkURL?.Url || '#'}>
                  {p.BannerType === 'Upcoming Event' ? 'Register Now' : 'View Details'} <Icon iconName="ArrowRight" />
                </a>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};
