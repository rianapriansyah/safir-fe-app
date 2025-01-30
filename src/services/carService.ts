import supabase from '../utils/supabase'

export async function getAllCars() {
  const { data, error } = await supabase.from('car').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export async function getAllCarsWithLatestTransaction() {
  const { data, error } = await supabase.from('v_latest_car_transactions').select('*');
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