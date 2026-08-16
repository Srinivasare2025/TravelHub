import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { useThemeContext } from '../../../../state/ThemeContext';
import { ContentCard, SectionHeading, LoadingSpinner } from '../../../../shared/components';
import { heroPlaceholderImage, cardPlaceholderImage, offerBannerPlaceholderImage } from '../../../../assets/images';
import { IPromotion, INewsItem, IQuickLink, INotification } from '../../../../models';
import styles from './HomePage.module.scss';

export const HomePage: React.FC = () => {
  const { service, config } = useServiceContext();
  const { theme } = useThemeContext();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [promotions, setPromotions] = React.useState<IPromotion[]>([]);
  const [news, setNews] = React.useState<INewsItem[]>([]);
  const [quickLinks, setQuickLinks] = React.useState<IQuickLink[]>([]);
  const [notifications, setNotifications] = React.useState<INotification[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // Each call gets its own fallback instead of sharing one Promise.all —
    // a Promise.all rejects as soon as ANY of its promises rejects, which was
    // wiping out sections (e.g. quick links) that had already loaded fine
    // just because a sibling list (e.g. news/promotions) failed or isn't
    // provisioned yet. A list not being provisioned still surfaces via the
    // ConfigWarningBanner (see Layout); here we just fail soft per-section.
    Promise.all([
      service.getActivePromotions(6).catch(() => []),
      service.getFeaturedNews(6).catch(() => []),
      service.getQuickLinks().catch(() => []),
      service.getRecentNotifications().catch(() => [])
    ]).then(([promos, newsItems, links, notifs]) => {
      if (cancelled) return;
      setPromotions(promos);
      setNews(newsItems);
      setQuickLinks(links);
      setNotifications(notifs);
    }).finally(() => { if (!cancelled) setLoading(false); });
    service.logEvent('PageView', '/home').catch(() => { /* non-fatal */ });
    return () => { cancelled = true; };
  }, [service]);

  if (loading) return <LoadingSpinner label="Loading Travel Hub…" />;

  const heroImage = config.heroImageUrl || heroPlaceholderImage(theme.palette.primary, theme.palette.secondary);
  const updateItem = notifications[0];
  const bookingLinks = quickLinks.filter((l) => l.Category === 'Booking').slice(0, 3);
  const exclusivePromo = promotions.filter((p) => p.BannerType === 'Exclusive')[0] || promotions[0];

  return (
    <div className={styles.page}>
      {/*
        Hero: text+search and the Important Update card are laid out side by
        side WITHIN the hero's own flex row (not position:absolute), so the
        hero's height always grows to fit both — nothing below it can ever
        be overlapped, regardless of how much update-card content there is.
      */}
      <div className={styles.hero} style={{ backgroundImage: `url('${heroImage}')` }}>
        <div className={styles.heroRow}>
          <div className={styles.heroText}>
            <h1>Your Journey, Our Priority</h1>
            <p>All your travel information, resources and booking access in one place.</p>
            <div className={styles.heroSearch}>
              <Icon iconName="Search" />
              <input type="text" placeholder="Search travel policies, guides, FAQs..." onFocus={() => navigate('/resources')} readOnly />
            </div>
          </div>
          {updateItem && (
            <div className={styles.updateCard}>
              <h5><Icon iconName="Warning" /> Important Update</h5>
              <p>{updateItem.Title}</p>
              <button type="button" onClick={() => navigate(updateItem.route)}>View Details &rarr;</button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.overlapCard}>
        <div className={styles.overlapSection}>
          <h4>Book with Concur</h4>
          <p>Quick access to your travel booking platform</p>
          <div className={styles.iconRow}>
            {(bookingLinks.length ? bookingLinks : quickLinks.slice(0, 3)).map((link) => (
              <a key={link.Id} className={styles.iconLink} href={link.URL.Url} target={link.OpenInNewTab ? '_blank' : undefined} rel="noopener noreferrer">
                <span className={styles.iconBadge}><Icon iconName={link.IconClass || 'Airplane'} /></span>
                <span>{link.Title}</span>
              </a>
            ))}
          </div>
        </div>
        <div className={styles.overlapSection}>
          <h4>Quick Links</h4>
          <p>Jump straight to the page you need</p>
          <div className={styles.iconRow}>
            <a className={styles.iconLink} onClick={() => navigate('/policies')}><span className={styles.iconBadge}><Icon iconName="Shield" /></span><span>Travel Policies</span></a>
            <a className={styles.iconLink} onClick={() => navigate('/resources?type=Guide')}><span className={styles.iconBadge}><Icon iconName="ReadingMode" /></span><span>User Guides</span></a>
            <a className={styles.iconLink} onClick={() => navigate('/resources?type=Form')}><span className={styles.iconBadge}><Icon iconName="DocumentSet" /></span><span>Travel Forms</span></a>
            <a className={styles.iconLink} onClick={() => navigate('/faqs')}><span className={styles.iconBadge}><Icon iconName="Help" /></span><span>FAQs</span></a>
          </div>
        </div>
      </div>

      {/* Two-column: Featured Resources + Latest Announcements, tight consistent spacing (no dead gap before the offer banner) */}
      <div className={styles.twoCol}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3>Featured Resources</h3></div>
          <div className={styles.resourceMini}>
            <a onClick={() => navigate('/policies')}><Icon iconName="Shield" /><strong>Travel Policies</strong><span>View Policies &rarr;</span></a>
            <a onClick={() => navigate('/resources?type=Guide')}><Icon iconName="ReadingMode" /><strong>System Guides</strong><span>View Guides &rarr;</span></a>
            <a onClick={() => navigate('/resources?type=Form')}><Icon iconName="DocumentSet" /><strong>Travel Forms</strong><span>View Forms &rarr;</span></a>
            <a onClick={() => navigate('/faqs')}><Icon iconName="Help" /><strong>FAQs</strong><span>View FAQs &rarr;</span></a>
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3>Latest Announcements</h3><a onClick={() => navigate('/news')}>View All &rarr;</a></div>
          <div className={styles.announceList}>
            {notifications.length === 0 && <p className={styles.empty}>Nothing new yet.</p>}
            {notifications.map((n, i) => (
              <div key={i} className={styles.announceItem}>
                <span className={styles.announceIcon}><Icon iconName={n.kind === 'News' ? 'News' : 'Megaphone'} /></span>
                <div>
                  <h5>{n.Title}</h5>
                  <p>{new Date(n.date).toLocaleDateString()}</p>
                  <a onClick={() => navigate(n.route)}>View Details &rarr;</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {exclusivePromo && (
        <div
          className={styles.offerBanner}
          style={{ backgroundImage: `url('${exclusivePromo.BannerImage?.Url || offerBannerPlaceholderImage(theme.palette.primary, theme.palette.secondary)}')` }}
        >
          <div className={styles.offerContent}>
            <h3>{exclusivePromo.Title}</h3>
            <p>{exclusivePromo.Description}</p>
            <button type="button" onClick={() => navigate('/promotions')}>View Offer <Icon iconName="ArrowRight" /></button>
          </div>
        </div>
      )}

      <SectionHeading title="I want to..." />
      <div className={styles.actionChips}>
        <a onClick={() => navigate('/book-travel')}><Icon iconName="Airplane" /> Book a Flight</a>
        <a onClick={() => navigate('/book-travel')}><Icon iconName="CityNext" /> Book a Hotel</a>
        <a onClick={() => navigate('/book-travel')}><Icon iconName="Car" /> Book a Car</a>
        <a onClick={() => navigate('/travel-info/visa-requirements')}><Icon iconName="ContactCard" /> Check Visa Requirements</a>
        <a onClick={() => navigate('/book-travel')}><Icon iconName="ReceiptForecast" /> Claim Expense</a>
        <a onClick={() => navigate('/resources?type=Form')}><Icon iconName="Download" /> Download Forms</a>
        <a onClick={() => navigate('/resources?type=Guide')}><Icon iconName="Map" /> View Travel Guides</a>
      </div>

      <div className={styles.twoCol}>
        <div>
          <SectionHeading title="News & Updates" viewAllRoute="/news" />
          <div className={styles.cardGridSingle}>
            {news.length === 0 && <p className={styles.empty}>No news published yet.</p>}
            {news.slice(0, 3).map((n) => (
              <ContentCard
                key={n.Id}
                title={n.Title}
                summary={n.Summary}
                imageUrl={n.ThumbnailImage?.Url || cardPlaceholderImage(theme.palette.primary, theme.palette.secondary, n.Category.toLowerCase() as 'news')}
                pillLabel={n.Category}
                metaRight={<span>{new Date(n.PublishDate).toLocaleDateString()}</span>}
                onClick={() => navigate('/news')}
              />
            ))}
          </div>
        </div>
        <div>
          <SectionHeading title="Promotions & Events" viewAllRoute="/promotions" />
          <div className={styles.cardGridSingle}>
            {promotions.length === 0 && <p className={styles.empty}>No active promotions.</p>}
            {promotions.slice(0, 3).map((p) => (
              <ContentCard
                key={p.Id}
                title={p.Title}
                summary={p.Description}
                imageUrl={p.BannerImage?.Url || cardPlaceholderImage(theme.palette.primary, theme.palette.secondary, p.BannerType === 'Limited Time' ? 'promo' : p.BannerType === 'Exclusive' ? 'exclusive' : p.BannerType === 'Upcoming Event' ? 'upcoming' : 'announcement')}
                ribbonLabel={p.BannerType}
                ribbonVariant={p.BannerType === 'Limited Time' ? 'limited' : p.BannerType === 'Exclusive' ? 'exclusive' : p.BannerType === 'Upcoming Event' ? 'event' : 'announcement'}
                onClick={() => navigate('/promotions')}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
