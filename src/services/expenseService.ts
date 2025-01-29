import supabase from '../utils/supabase'

export async function getAllExpensesByVin(vin:string) {
  const { data, error } = await supabase.from('expense').select('*').eq('vin', vin);
  if (error) throw new Error(error.message);
  return data;
}