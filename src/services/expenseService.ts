import { Expense } from '../types/interfaceModels';
import supabase from '../utils/supabase'

export async function getAllExpenses() {
  const { data, error } = await supabase.from('expense_summary').select('*').order('created_at', {ascending:false});
  if (error) throw new Error(error.message);
  return data;
}

export async function getAllExpensesByVin(vin:string) {
  const { data, error } = await supabase.from('expense_summary').select('*').eq('vin',vin).order('created_at', {ascending:false});
  
  if (error) throw new Error(error.message);
  return data;
}

export async function getSumOfExpenseByRental() {
  const { data, error } = await supabase.from('total_general_expenses').select('*').single();
  if (error) throw new Error(error.message);
  return data;
}

export async function get_expense_categories() {
  const { data, error } = await supabase.from('expense_categories').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export async function insert_expense(expense:Expense) {
  const { data, error } = await supabase.from('expense').insert([{vin:expense.vin, amount:expense.amount, description:expense.description, category_id:expense.category_id}]).select();

  if (error) throw new Error(error.message);
  return data;
}

