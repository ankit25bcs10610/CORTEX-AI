import { endOfDay, format, isBefore, isToday, parseISO, startOfWeek, subDays } from "date-fns";

export const todayKey = () => format(new Date(), "yyyy-MM-dd");
export const toDateKey = (date) => format(new Date(date), "yyyy-MM-dd");

export const isOverdue = (deadline, done) => {
  if (!deadline || done) return false;
  return isBefore(parseISO(deadline), endOfDay(new Date()));
};

export const isDueToday = (deadline) => (deadline ? isToday(parseISO(deadline)) : false);

export const weekKeys = () => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  return Array.from({ length: 7 }).map((_, i) => format(subDays(start, -i), "yyyy-MM-dd"));
};
