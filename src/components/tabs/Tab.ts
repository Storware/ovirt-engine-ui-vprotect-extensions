export interface Tab {
  label: string;
  path: string;
}

export type TabList = {
  tabs: Tab[];
  inkStyle: Record<string, { width: string; left: string }>;
};
