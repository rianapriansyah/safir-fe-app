import { Car, Transaction } from "../types/interfaceModels";

export function calculateUsageDurationAndCost(car:Car, transaction:Transaction): { totalCost: number; durationText: string } {
  debugger;
	const outDate = new Date(transaction.out);
  const inDate = new Date();
  const dailyRate = car.dailyRate;
  const threeHourRate = car.threeHourRate;
  const lateChargeRate = 25000;
  const diffInMs = inDate.getTime() - outDate.getTime();
  const totalHours = Math.ceil(diffInMs / (1000 * 60 * 60)); // Total hours, rounded up
  let totalCost = 0;
  let durationText = "";

  if (transaction.rentType === "Daily" && totalHours <= 4) {
    // Rule 6: If rent type is daily and duration is < 4 hours, count as daily
    totalCost = dailyRate;
    durationText = `1 hari (Daily rate applied)`;
  } else if (totalHours <= 4) {
    // Up to 4 hours
    totalCost = threeHourRate;
    durationText = `${totalHours} jam (Three-hour rate)`;
  } else if (totalHours <= 24) {
    // 4 to 24 hours
    totalCost = dailyRate;
    durationText = `${totalHours} jam (Daily rate)`;
  } else {
    // More than 24 hours
    const fullDays = Math.floor(totalHours / 24); // Full days
    const excessHours = totalHours % 24;

    if (excessHours <= 4) {
      // Excess up to 4 hours
      totalCost = fullDays * dailyRate + excessHours * lateChargeRate;
      durationText = `${fullDays} hari ${excessHours} jam (Late charge applied)`;
    } else {
      // Excess more than 4 hours
      totalCost = (fullDays + 1) * dailyRate;
      durationText = `${fullDays + 1} hari`;
    }
  }

  totalCost = totalCost - transaction.dp;

  return { totalCost, durationText };
}
