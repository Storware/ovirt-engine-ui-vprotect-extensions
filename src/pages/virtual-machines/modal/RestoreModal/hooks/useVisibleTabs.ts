import type { AccordionActiveIndexType } from 'primereact/accordion';
import { useEffect, useState } from 'react';

const GENERAL_TAB_INDEX = 0;
const NETWORKING_TAB_INDEX = 2;

export const useVisibleTabs = ({ loadingNetworkSettings }) => {
  const [visibleTabs, setVisibleTabs] = useState<AccordionActiveIndexType>([
    GENERAL_TAB_INDEX,
  ]);

  useEffect(() => {
    if (!loadingNetworkSettings) {
      return;
    }

    if (typeof visibleTabs !== 'number') {
      setVisibleTabs(
        visibleTabs.filter((index) => index !== NETWORKING_TAB_INDEX),
      );
    }
  }, [loadingNetworkSettings]);

  return { visibleTabs, setVisibleTabs };
};
