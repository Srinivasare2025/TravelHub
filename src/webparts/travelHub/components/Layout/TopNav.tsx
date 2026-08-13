import * as React from 'react';
import { Icon } from '@fluentui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../navigation/navConfig';
import styles from './TopNav.module.scss';

export const TopNav: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | undefined>(undefined);

  const isTravelInfoActive = location.pathname.startsWith('/travel-info');

  return (
    <nav className={`${styles.row2} ${mobileOpen ? styles.navOpen : ''}`}>
      <button type="button" className={styles.navToggle} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
        <Icon iconName="GlobalNavButton" />
      </button>
      <ul className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          if (item.children) {
            return (
              <li key={item.key} className={`${styles.hasDropdown} ${isTravelInfoActive ? styles.active : ''}`}>
                <button type="button" onClick={() => setOpenDropdown(openDropdown === item.key ? undefined : item.key)}>
                  {item.label} <Icon iconName="ChevronDown" style={{ fontSize: 9 }} />
                </button>
                <div className={`${styles.dropdown} ${openDropdown === item.key ? styles.dropdownOpen : ''}`}>
                  {item.children.map((child) => (
                    <NavLink key={child.key} to={child.route} onClick={() => { setOpenDropdown(undefined); setMobileOpen(false); }}>
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              </li>
            );
          }
          return (
            <li key={item.key}>
              <NavLink to={item.route as string} end={item.route === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => (isActive ? styles.activeLink : undefined)}>
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
