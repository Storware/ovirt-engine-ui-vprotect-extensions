import { PATHS } from '@/const/paths';

export function useDevNavigation() {
  return {
    visible: process.env.NODE_ENV === 'development',
    paths: Object.entries(PATHS).map(([key, value]) => ({
      id: key,
      href: value,
    })),
  };
}
