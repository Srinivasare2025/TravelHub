import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './SectionHeading.module.scss';

export interface ISectionHeadingProps {
  title: string;
  viewAllRoute?: string;
  onViewAllClick?: () => void;
}

export const SectionHeading: React.FC<ISectionHeadingProps> = ({ title, viewAllRoute, onViewAllClick }) => (
  <div className={styles.heading}>
    <h2>{title}</h2>
    {viewAllRoute && (
      <Link to={viewAllRoute} onClick={onViewAllClick}>View All &rarr;</Link>
    )}
  </div>
);
