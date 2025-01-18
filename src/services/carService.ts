import supabase from '../utils/supabase'

export async function getAllCars() {
  const { data, error } = await supabase.from('car').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export async function getAllCarsWithLatestTransaction() {
  const { data, error } = await supabase.from('v_latest_car_transactions').select('vin, name, in, out, completed, ready, dailyRate, renter_name');
  if (error) throw new Error(error.message);
  return data;
}

export async function getCarById(vin: string) {
  const { data, error } = await supabase.from('car').select('*').eq('vin', vin).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateCar(vin: string, ready:boolean) {
  const { data, error } = await supabase.from('car').update({ready:ready}).eq('vin', vin);
  if (error) throw new Error(error.message);
  return data;
}

// export async function getLastDayCarUsage(vin: string) {
//   const { data, error } = await supabase
//     .from("transaction")
//     .select("*")
//     .eq("vin", vin) // Filter by car VIN
//     .is('completed', false) // Ensure the car was checked in
//     .order("in", { ascending: false }) // Get the most recent transaction
//     .limit(1); // Only fetch the latest transaction

//   if (error) {
//     console.error("Error fetching last day usage:", error.message);
//     return null;
//   }

// 	if (data && data.length > 0) {
//     const lastTransaction = data[0];
//     const lastDay = new Date(lastTransaction.in); // Get the `in` field
//     return lastDay; // Return the last day
//   }

//   return null; // No usage data found
// }