import { RawTransactionData, Transaction } from '../types/interfaceModels';
import supabase from '../utils/supabase'

export async function getAllTransactions() {
	const { data, error } = await supabase.from('transaction').select('*');
	if (error) throw new Error(error.message);
	return data;
}

export async function addTransaction(transaction: Transaction) {
	const { data, error } = await supabase.from('transaction').insert([
		{
			vin:transaction.vin,
			car_name:transaction.name,
			renter_name:transaction.renterName,
			renter_phone:transaction.renterPhone,
			rent_type:transaction.rent_type,
			out:transaction.out,
			fuel_out:transaction.fuelOut,
			fuel_in:transaction.fuelIn,
			dp:transaction.dp,
			actual_payment:transaction.actualPayment,
			desc:transaction.desc,
			completed:transaction.completed,
			paid:transaction.paid
		},
	]);
	if (error) throw new Error(error.message);
	return data;
}

export async function updateTransaction(id: number, transaction: Partial<Omit<Transaction, 'id'>>) {
	const { data, error } = await supabase.from('transaction').update({
		in:new Date(),
		fuel_in:transaction.fuelIn,
		dp:transaction.dp,
		actual_payment:transaction.actualPayment,
		completed:transaction.completed,
		paid:transaction.paid
	}).eq('id', id);
	if (error) throw new Error(error.message);
	return data;
}

export async function getAllTransactionsByVin(vin: string) {
	const { data, error } = await supabase.from('transaction').select('*').eq('vin', vin).order('out', {ascending:false});
	if (error) throw new Error(error.message);

	// Map the raw data to the Transaction interface
	return (data || []).map(mapToTransaction);
}

export async function get_amount_by_filter(vin:string) {
  const { data, error } = await supabase.rpc('get_amount_by_vin', {filter:vin });
	console.log(data);
  if (error) throw new Error(error.message);
  
  return data;
}

export async function getLatestTransactionByVinAndCompletedStatus(vin: string, completed:string) {
  const { data, error } = await supabase
    .from('transaction')
    .select('*')
    .eq('vin', vin)
    .is('completed', completed) // Assuming 'in' is null for unfinished transactions
    .order('out', { ascending: false })
    .limit(1)
    .single();

  if (error) throw new Error(error.message);
  
	// Map the result to the Transaction interface
  if (data) {
    return mapToTransaction(data);
  }
}

function mapToTransaction(rawData: RawTransactionData): Transaction {
  return {
    id: rawData.id,
    vin: rawData.vin,
    name: rawData.car_name || '', // Fallback to an empty string if the field is missing
    renterName: rawData.renter_name || '',
    renterPhone: rawData.renter_phone || '',
    out: new Date(rawData.out), // Convert to Date object
    in: rawData.in ? new Date(rawData.in) : new Date(), // Handle null for unfinished transactions
    rent_type: rawData.rent_type || '',
    fuelOut: rawData.fuel_out || '',
    fuelIn: rawData.fuel_in || '',
    dp: rawData.dp || 0,
    actualPayment: rawData.actual_payment || 0,
    desc: rawData.desc || '',
		completed:rawData.completed||false,
		paid:rawData.paid,
		current_balance:rawData.current_balance
  };
}