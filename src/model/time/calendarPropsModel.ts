export type DateType = Date | Date[];

export interface CalendarPropsModel {
  date: DateType;
  setDate: (date: Date[] | Date) => void;
}
