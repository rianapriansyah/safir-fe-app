export function getMonthlyUsagePercentage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Day 1 of the current month
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month

  const totalDays = endOfMonth.getDate(); // Total days in the month
  const daysElapsed = Math.floor((now.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24)) + 1; // Days elapsed including today

  const percentage = Math.round((daysElapsed / totalDays) * 100); // Calculate percentage
  return { percentage, totalDays, daysElapsed };
}