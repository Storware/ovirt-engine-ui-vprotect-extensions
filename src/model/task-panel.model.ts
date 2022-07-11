export enum OriginEntityTypeEnum {
  USER = 'USER',
  SCHEDULE = 'SCHEDULE',
  SYSTEM_SCHEDULE = 'SYSTEM_SCHEDULE',
}

export const OriginEntityType: {
  [key in OriginEntityTypeEnum]: {
    link: string;
    icon: string;
    privilege: string;
  };
} = {
  [OriginEntityTypeEnum.USER]: {
    icon: 'user',
    link: '/access-management/users/',
    privilege: 'MGMT_RBAC_ACCESS_READ',
  },
  [OriginEntityTypeEnum.SCHEDULE]: {
    icon: 'clock',
    link: null,
    privilege: null,
  },
  [OriginEntityTypeEnum.SYSTEM_SCHEDULE]: {
    icon: 'refresh',
    link: null,
    privilege: null,
  },
};
