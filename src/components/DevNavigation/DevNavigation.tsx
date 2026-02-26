import { useDevNavigation } from './useDevNavigation';
import styles from './DevNavigation.module.scss';

export function DevNavigation() {
  const devNavigation = useDevNavigation();

  if (!devNavigation.visible) {
    return null;
  }

  return (
    <div className={styles.devNavigation}>
      {devNavigation.paths.map((pathItem) => (
        <a key={pathItem.id} href={pathItem.href}>
          {pathItem.id}
        </a>
      ))}
    </div>
  );
}
