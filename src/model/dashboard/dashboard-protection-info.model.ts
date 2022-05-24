import { DashboardProtectionStats } from './dashboard-protection-stats.model';

export class DashboardProtectionInfoModel {
  allEntities: DashboardProtectionStats;
  vm: DashboardProtectionStats;
  app: DashboardProtectionStats;
  storage: DashboardProtectionStats;
  cloud: DashboardProtectionStats;
  cloudUser: DashboardProtectionStats;
  cloudSite: DashboardProtectionStats;
  cloudGroup: DashboardProtectionStats;
  endpoints: Omit<DashboardProtectionStats, 'noSchedule'>;
}
