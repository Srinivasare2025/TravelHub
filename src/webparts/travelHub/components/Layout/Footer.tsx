import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useServiceContext } from '../../../../state/ServiceContext';
import styles from './Footer.module.scss';

export const Footer: React.FC = () => {
  const { config } = useServiceContext();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}><Icon iconName="AirplaneSolid" /></span>
          <span>Let&rsquo;s journey towards a more sustainable future, together.</span>
        </div>
        <div className={styles.links}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Contact Us</a>
          <a href="#">Sitemap</a>
        </div>
        <div className={styles.social}>
          <a href="#" title="LinkedIn"><Icon iconName="LinkedInLogo" /></a>
          <a href="#" title="Twitter"><Icon iconName="Globe" /></a>
          <a href="#" title="YouTube"><Icon iconName="Video" /></a>
        </div>
      </div>
      <div className={styles.copyright}>&copy; {year} {config.organizationName || 'Travel Hub'}</div>
    </footer>
  );
};
