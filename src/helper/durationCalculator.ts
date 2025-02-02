import { Car, Transaction } from "../types/interfaceModels";

export function calculateUsageDurationAndCost(car:Car, transaction:Transaction): { totalCost: number } {
  debugger;
	const outDate = new Date(transaction.out);
  const inDate = new Date();
  const dailyRate = car.dailyRate;
  const threeHourRate = car.threeHourRate;
  const lateChargeRate = 25000;
  const diffInMs = inDate.getTime() - outDate.getTime();
  const totalHours = Math.ceil(diffInMs / (1000 * 60 * 60)); // Total hours, rounded up
  let totalCost = 0;

  if (transaction.rentType === "Daily" && totalHours <= 4) {
    // Rule 6: If rent type is daily and duration is < 4 hours, count as daily
    totalCost = dailyRate;
  } else if (totalHours <= 4) {
    // Up to 4 hours
    totalCost = threeHourRate;
  } else if (totalHours <= 24) {
    // 4 to 24 hours
    totalCost = dailyRate;
  } else {
    // More than 24 hours
    const fullDays = Math.floor(totalHours / 24); // Full days
    const excessHours = totalHours % 24;

    if (excessHours <= 1) {
      // Ignore excess up to 1 hour (no extra charge)
      totalCost = fullDays * dailyRate;
    } else if (excessHours <= 4) {
      // Excess between 2 to 4 hours (late charge applied)
      totalCost = fullDays * dailyRate + excessHours * lateChargeRate;
    } else {
      // Excess more than 4 hours (counted as full day)
      totalCost = (fullDays + 1) * dailyRate;
    }    
  }

  totalCost = totalCost - transaction.dp;

  return { totalCost };
}
