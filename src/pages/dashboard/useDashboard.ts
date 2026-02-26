import isNotOpenstackBuild from '@/utils/isNotOpenstackBuild';

export function useDashboard() {
  return {
    isNotOpenstackBuild,
  };
}
