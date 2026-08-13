import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { Breadcrumb } from '../Layout/Breadcrumb';
import { LoadingSpinner, RichText, ErrorState } from '../../../../shared/components';
import { IPolicy, IForm } from '../../../../models';
import styles from './PolicyDetailPage.module.scss';

export const PolicyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { service } = useServiceContext();
  const navigate = useNavigate();

  const [policy, setPolicy] = React.useState<IPolicy | undefined>(undefined);
  const [relatedForms, setRelatedForms] = React.useState<IForm[]>([]);
  const [relatedPolicies, setRelatedPolicies] = React.useState<IPolicy[]>([]);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    service.getPolicyById(Number(id)).then((p) => {
      setPolicy(p);
      service.logEvent('PageView', `/policies/${id}`).catch(() => { /* non-fatal */ });
      if (p.PolicyCategory) {
        service.getRelatedFormsByCategory(p.PolicyCategory).then(setRelatedForms).catch(() => setRelatedForms([]));
        service.getRelatedPolicies(p.PolicyCategory, p.Id).then(setRelatedPolicies).catch(() => setRelatedPolicies([]));
      }
    }).catch(() => setError('This policy may have been removed or you may not have access.'))
      .finally(() => setLoading(false));
  }, [service, id]);

  if (loading) return <LoadingSpinner />;
  if (error || !policy) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Travel Policies', route: '/policies' }, { label: 'Not found' }]} />
        <ErrorState message={error || 'Policy not found.'} />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Travel Policies', route: '/policies' }, { label: policy.Title }]} />
      <div className={styles.layout}>
        <div className={styles.body}>
          <h1>{policy.Title}</h1>
          <div className={styles.meta}>
            Category: <strong>{policy.PolicyCategory}</strong> &nbsp;&middot;&nbsp;
            Last updated: {new Date(policy.Modified).toLocaleDateString()}
            {policy.ReviewedBy?.Title && <> &nbsp;&middot;&nbsp; Reviewed by {policy.ReviewedBy.Title}</>}
          </div>
          <RichText className={styles.bodyContent} html={policy.PolicyBody || `<p>${policy.Summary}</p>`} />
        </div>
        <div>
          <div className={styles.sidebarCard}>
            <h4><Icon iconName="Download" /> Downloads</h4>
            <a className={styles.downloadItem} href={policy.FileRef}>
              <Icon iconName="PDF" />
              <span><strong>{policy.FileLeafRef}</strong><span>Policy document</span></span>
            </a>
            {relatedForms.map((f) => (
              <a key={f.Id} className={styles.downloadItem} href={f.FileRef}>
                <Icon iconName="Document" />
                <span><strong>{f.Title}</strong><span>Related form</span></span>
              </a>
            ))}
          </div>
          <div className={styles.sidebarCard}>
            <h4><Icon iconName="Link" /> Related Policies</h4>
            {relatedPolicies.length === 0 && <p className={styles.empty}>No related policies in this category.</p>}
            {relatedPolicies.map((p) => (
              <a key={p.Id} className={styles.relatedLink} onClick={() => navigate(`/policies/${p.Id}`)}>{p.Title}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
