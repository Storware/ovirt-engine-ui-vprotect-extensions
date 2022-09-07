export const RetentionHints = [
  'TO_REMOVE',
  'ARCHIVE',
  'STANDARD_RETENTION',
] as const;

export enum RetentionHintKeys {
  TO_REMOVE = 'TO_REMOVE',
  ARCHIVE = 'ARCHIVE',
  STANDARD_RETENTION = 'STANDARD_RETENTION',
}

export type RetentionHint = typeof RetentionHints[number];

export const RetentionHintKeysWithDescription = {
  [RetentionHintKeys.TO_REMOVE]: {
    name: RetentionHintKeys.TO_REMOVE,
    description: 'Mark as expired',
  },
  [RetentionHintKeys.ARCHIVE]: {
    name: RetentionHintKeys.ARCHIVE,
    description: 'Mark to keep',
  },
  [RetentionHintKeys.STANDARD_RETENTION]: {
    name: RetentionHintKeys.STANDARD_RETENTION,
    description: 'Use retention settings from the policy',
  },
};

export const RetentionHintsWithDescription = Object.keys(
  RetentionHintKeysWithDescription,
).map((name) => RetentionHintKeysWithDescription[name]);

export const RetentionHintsDescription = {
  [RetentionHintKeys.TO_REMOVE]: 'Mark as expired',
  [RetentionHintKeys.ARCHIVE]: 'Mark to keep',
  [RetentionHintKeys.STANDARD_RETENTION]:
    'Use retention settings from the policy',
  RECREATE: 'Recreate',
};
