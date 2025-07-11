import { CarBalance, Expense, Transaction, TransType } from '../types/interfaceModels';
import supabase from '../utils/supabase'

export async function insert_balance(carBalance:CarBalance) {
  const { data, error } = await supabase.from('car_balance').insert([{ 
		vin:carBalance.vin,
		amount:carBalance.amount,
		transaction_type:carBalance.transaction_type,
		description:carBalance.description,
		reference_id:carBalance.reference_id,
		name:carBalance.name
	}]).select();
				
  if (error) throw new Error(error.message);
  return data;
}

export async function get_balance_by_vin(vin: string) {
  const { data, error } = await supabase.from('car_balance').select('*').eq('vin', vin).order('created_at',{ascending:false});
  if (error) throw new Error(error.message);
  return data;
}

export function mapTransactionToBalance(transaction: Transaction, finalPayment:boolean): CarBalance {
	return {
		vin: transaction.vin,
		name: transaction.name || '', // Fallback to an empty string if the field is missing
		amount:finalPayment? Number(transaction.actualPayment) : Number(transaction.dp),
		description:transaction.desc,
		reference_id:transaction.renterName +' - '+transaction.renterPhone,
		transaction_type:TransType.deposit,
		id:transaction.id,
		created_at:new Date()
	};
}

export function mapExpenseToBalance(expense: Expense): CarBalance {
	return {
		vin: expense.vin,
		name: expense.category || '', // Fallback to an empty string if the field is missing
		amount:-Math.abs(expense.amount),
		description:expense.description,
		reference_id:expense.vin,
		transaction_type: expense.category_id === 29 || expense.category_id === 30 ? TransType.withdrawal : TransType.expense,
		id:expense.id,
		created_at:new Date()
	};
}