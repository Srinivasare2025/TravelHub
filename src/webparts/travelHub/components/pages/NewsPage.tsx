import * as React from 'react';
import { useServiceContext } from '../../../../state/ServiceContext';
import { useThemeContext } from '../../../../state/ThemeContext';
import { Breadcrumb } from '../Layout/Breadcrumb';
import { LoadingSpinner } from '../../../../shared/components';
import { cardPlaceholderImage } from '../../../../assets/images';
import { INewsItem } from '../../../../models';
import styles from './NewsPage.module.scss';

export const NewsPage: React.FC = () => {
  const { service } = useServiceContext();
  const { theme } = useThemeContext();
  const [news, setNews] = React.useState<INewsItem[] | undefined>(undefined);

  React.useEffect(() => {
    service.getFeaturedNews(500).then(setNews).catch(() => setNews([]));
    service.logEvent('PageView', '/news').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!news) return <LoadingSpinner />;
  if (news.length === 0) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'News & Updates' }]} />
        <h1 className={styles.title}>News & Updates</h1>
        <p className={styles.empty}>No news published yet.</p>
      </div>
    );
  }

  const featured = news.filter((n) => n.IsFeatured)[0] || news[0];
  const rest = news.filter((n) => n.Id !== featured.Id);
  const imageFor = (n: INewsItem): string => n.ThumbnailImage?.Url || cardPlaceholderImage(theme.palette.primary, theme.palette.secondary, n.Category.toLowerCase() as 'news');

  return (
    <div>
      <Breadcrumb items={[{ label: 'News & Updates' }]} />
      <h1 className={styles.title}>News & Updates</h1>
      <p className={styles.sub}>Stay informed with the latest travel news and updates</p>

      <div className={styles.feature}>
        <div className={styles.featureThumb} style={{ backgroundImage: `url('${imageFor(featured)}')` }} />
        <div className={styles.featureBody}>
          <span className={styles.pill}>{featured.Category}</span>
          <h2>{featured.Title}</h2>
          <p>{featured.Summary}</p>
          <span className={styles.date}>{new Date(featured.PublishDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className={styles.list}>
        {rest.map((n) => (
          <div key={n.Id} className={styles.listItem}>
            <div className={styles.listThumb} style={{ backgroundImage: `url('${imageFor(n)}')` }} />
            <div>
              <h4>{n.Title}</h4>
              <span>{n.Category} &middot; {new Date(n.PublishDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
