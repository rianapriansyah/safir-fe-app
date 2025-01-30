import supabase from '../utils/supabase'

export async function getAllExpensesByVin() {
  const { data, error } = await supabase.from('expense_summary').select('*');
  if (error) throw new Error(error.message);
  return data;
}