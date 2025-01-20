import supabase from '../utils/supabase'

export async function getAllTransactions() {
	const { data, error } = await supabase.from('transaction').select('*');
	if (error) throw new Error(error.message);
	return data;
}

export async function getCarsWithIncomeByType(owned:boolean) {
  const { data, error } = await supabase.from('payment_summary_by_vin').select('*').eq('owned',owned);
  if (error) throw new Error(error.message);
  return data;
}

export async function getSumActualIncomeByCarType(owned: boolean) {
	const { data, error } = await supabase.from('car_income_summary').select('total_income').eq('owned', owned).single();
	if (error) throw new Error(error.message);

	return data;
}

