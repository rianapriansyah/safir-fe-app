import axios from 'axios';
import { Car, Transaction } from '../types/interfaceModels';
 
// const API_BASE_URL = 'http://localhost:3000/api'; 
const API_BASE_URL = 'http://192.168.1.4:3000/api'; //uncomment this for testing on phone
// const API_BASE_URL = 'https://safir-be-app-self.vercel.app/api';

export const fetchCars = () => axios.get(`${API_BASE_URL}/cars`);
export const fetchCarByVin = (vin:string) => axios.get(`${API_BASE_URL}/cars?vin=${vin}`);
export const updateCar = (vin:string, carDate: Car) =>
  axios.put(`${API_BASE_URL}/cars?vin=${vin}`, carDate);

export const fetchTransactions = () => axios.get(`${API_BASE_URL}/transactions`);
export const fetchTransactionsByVin = (vin:string) => axios.get(`${API_BASE_URL}/transactions?vin=${vin}`);
export const fetchLatestUnfinishedTransactionByVin = (vin:string) => 
  axios.get(`${API_BASE_URL}/transactions?vin=${vin}&unfinished=false`);
export const createTransaction = (transactionData: Transaction) =>
  axios.post(`${API_BASE_URL}/transactions`, transactionData);
export const updateTransaction = (id:number, transactionData: Transaction) =>
  axios.put(`${API_BASE_URL}/transactions?id=${id}`, transactionData);

// export const createProduct = (productsData: any) =>
//   axios.post(`${API_BASE_URL}/products`, productsData);
// export const deleteProduct = (productId:any) =>
//   axios.delete(`${API_BASE_URL}/products/${productId}`);

// export const fetchCategories = () => axios.get(`${API_BASE_URL}/category`);
// export const createCategory = (categoryData: any) =>
//   axios.post(`${API_BASE_URL}/category`, categoryData);
// export const updateCategory = (categoryId:any, categoryData: any) =>
//   axios.put(`${API_BASE_URL}/category/${categoryId}`, categoryData);
// export const deleteCategory = (productId:any) =>
//   axios.delete(`${API_BASE_URL}/category/${productId}`);

// export const fetchPaymentMethods = () => axios.get(`${API_BASE_URL}/paymentmethods`);
// export const createTransaction = (transactionData: any) =>
//   axios.post(`${API_BASE_URL}/transactions`, transactionData);

// export const updateTransaction = (transactionId: any, transactionData:any) =>
//   axios.put(
//     `${API_BASE_URL}/transactions/${transactionId}`,
//     transactionData
//   );

// export const fetchTransaction = (storeId:any) => axios.get(`${API_BASE_URL}/transactions/store/${storeId}`);
// export const fetchUnpaidTransaction = (storeId:any) => axios.get(`${API_BASE_URL}/transactions/store/${storeId}/unpaid`);
// export const fetchTransactionByDate = (storeId:any, date:any) => axios.get(`${API_BASE_URL}/transactions/store/${storeId}/paid/by-date?date=${date}`);
// export const fetchParkedTransactions = () => axios.get(`${API_BASE_URL}/transactions/unpaid`);

// export const fetchDashboardData  = (storeId: number, filter: string, startDate?: string, endDate?: string) => axios.get(`${API_BASE_URL}/dashboard`, {params: { storeId, filter, startDate, endDate },});
