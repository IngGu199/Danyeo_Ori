export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function preRegistrationExpiry(festivalEndDate: string): Date {
  return addDays(new Date(`${festivalEndDate}T15:00:00.000Z`), 90);
}
