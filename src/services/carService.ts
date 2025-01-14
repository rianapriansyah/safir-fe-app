import { Car } from '../types/interfaceModels';
import supabase from '../utils/supabase'

export async function getAllCars() {
  const { data, error } = await supabase.from('car').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export async function getCarById(vin: string) {
  const { data, error } = await supabase.from('car').select('*').eq('vin', vin).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateCar(vin: string, car: Partial<Omit<Car, 'vin'>>) {
  const { data, error } = await supabase.from('car').update(car).eq('vin', vin);
  if (error) throw new Error(error.message);
  return data;
}