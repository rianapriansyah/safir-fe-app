import supabase from '../utils/supabase'

export async function getAllExpensesByVin() {
  const { data, error } = await supabase.from('expense_summary').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export async function getSumOfExpenseByRental() {
  const { data, error } = await supabase.from('total_general_expenses').select('*').single();
  if (error) throw new Error(error.message);
  return data;
}