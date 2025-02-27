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

export function mapTransactionToBalance(transaction: Transaction, finalPayment:boolean): CarBalance {
	return {
		vin: transaction.vin,
		name: transaction.name || '', // Fallback to an empty string if the field is missing
		amount:finalPayment? Number(transaction.actualPayment) : Number(transaction.dp),
		description:transaction.desc,
		reference_id:transaction.renterName +' - '+transaction.renterPhone,
		transaction_type:TransType.deposit,
		id:transaction.id
	};
}

export function mapExpenseToBalance(expense: Expense): CarBalance {
	return {
		vin: expense.vin,
		name: expense.category || '', // Fallback to an empty string if the field is missing
		amount:-Math.abs(expense.amount),
		description:expense.description,
		reference_id:expense.vin,
		transaction_type:TransType.expense,
		id:expense.id
	};
}