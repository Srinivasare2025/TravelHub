import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useServiceContext } from '../../../../state/ServiceContext';
import { Breadcrumb } from '../Layout/Breadcrumb';
import { LoadingSpinner, RichText, Pagination } from '../../../../shared/components';
import { IFaq } from '../../../../models';
import styles from './FaqsPage.module.scss';

const PAGE_SIZE = 5;

export const FaqsPage: React.FC = () => {
  const { service } = useServiceContext();
  const [faqs, setFaqs] = React.useState<IFaq[] | undefined>(undefined);
  const [category, setCategory] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [openId, setOpenId] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    service.getPublishedFaqs().then(setFaqs).catch(() => setFaqs([]));
    service.logEvent('PageView', '/faqs').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!faqs) return <LoadingSpinner />;

  const categories = Array.from(new Set(faqs.map((f) => f.Category)));
  const filtered = faqs.filter((f) => (!category || f.Category === category) && (!search || f.Title.toLowerCase().indexOf(search.toLowerCase()) !== -1));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <Breadcrumb items={[{ label: 'FAQs' }]} />
      <div className={styles.pageHeaderRow}>
        <div>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.sub}>Find answers to common travel questions</p>
        </div>
        <div className={styles.searchWrap}>
          <input type="text" placeholder="Search FAQs..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <Icon iconName="Search" />
        </div>
      </div>

      <div className={styles.faqTabs}>
        <span className={!category ? styles.faqTabActive : styles.faqTab} onClick={() => { setCategory(''); setPage(1); }}>All Questions</span>
        {categories.map((c) => (
          <span key={c} className={category === c ? styles.faqTabActive : styles.faqTab} onClick={() => { setCategory(c); setPage(1); }}>{c}</span>
        ))}
      </div>

      {pageItems.length === 0 ? (
        <p className={styles.empty}>No FAQs match your search.</p>
      ) : (
        pageItems.map((f) => (
          <div key={f.Id} className={styles.faqItem}>
            <div className={styles.faqQuestion} onClick={() => setOpenId(openId === f.Id ? undefined : f.Id)}>
              <span>{f.Title}</span>
              <Icon iconName="ChevronDown" style={{ transform: openId === f.Id ? 'rotate(180deg)' : undefined }} />
            </div>
            {openId === f.Id && <RichText className={styles.faqAnswer} html={f.Answer} />}
          </div>
        ))
      )}

      <Pagination page={currentPage} pageSize={PAGE_SIZE} totalCount={filtered.length} onPageChange={setPage} itemLabel="FAQs" />
    </div>
  );
};
