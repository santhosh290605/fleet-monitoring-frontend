import React from 'react';
import styles from './Legend.module.css';
import greenMarker from './green-car.png';
import yellowMarker from './yellow-car.png';
import redMarker from './red-car.png';

const statusIcons = {
  active: greenMarker,
  maintenance: yellowMarker,
  inactive: redMarker,
};

function Legend({ onStatusClick, selectedStatuses }) {
  const handleClick = (status) => {
    onStatusClick(status);
  };

  return (
    <div className={styles.legend__container}>
      <h4 className={styles.legend__title}>Vehicle Status Legend</h4>
      <ul className={styles.legend__list}>
        {['active', 'maintenance', 'inactive'].map((status) => (
          <li
            key={status}
            className={`${styles.legend__item} ${
              selectedStatuses.includes(status) ? styles.legend__selected : ''
            }`}
            onClick={() => handleClick(status)}
          >
            <img
              src={statusIcons[status]}
              alt={`${status} marker`}
              className={styles.legend__icon}
            />
            <span className={styles.legend__label}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Legend;
