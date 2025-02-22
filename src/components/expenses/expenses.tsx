import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
	SelectChangeEvent,
	Typography,
  Button,
  Stack,
} from '@mui/material';
import { Car, Expense } from '../../types/interfaceModels';
import { getAllCars } from '../../services/carService';
import { getAllExpenses, insert_expense } from '../../services/expenseService';
import { StyledTableCell, StyledTableRow } from '../common/table';
import ExpenseModal from './newExpenseModal';
import { insert_balance, mapExpenseToBalance } from '../../services/carBalanceService';

const emptyExpense:Expense={
  id: 0,
  vin: "",
  name:"",
  description: "",
  category: '',
  amount: 0,
  created_at: new Date,
  company_expense: false,
  category_id:27
};

const Expenses: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedVin, setSelectedVin] = useState<string>('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setModalState] = useState(false); // Modal state

  // Fetch car list on mount
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const carData = await getAllCars();
		setCars(carData);
		isFetching = false;
	};

  // Fetch transactions when a car is selected
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const expenseData = await getAllExpenses();
    setExpenses(expenseData);
		isFetching = false;
	};

  const handleCarChange = async (e: SelectChangeEvent<string>) => {
    setSelectedVin(e.target.value as string);
  };

	const openModal = () => {
		// setAction(action);
		// setSelectedProduct(product);
    setModalState(true);
  };

  const closeModal = () => {
		// setAction(action);
		// setSelectedProduct(product);
    setModalState(false);
  };

  const handleSave = async (expense: Expense) => {
		try {
      console.log('expense main page:', expense);
      
      await insert_expense(expense);

      if(!expense.company_expense){
        const balance = mapExpenseToBalance(expense);
        await insert_balance(balance);
      }
      
      alert("Berhasil");
      fetchExpenses(); // Refresh the Category list
      setModalState(false); // Close the modal
		} catch (error) {
      console.error('Kesalahan dalam menyimpan: ', error);
		}
	};

  // const handleDelete = async (expense: Expense) => {
	// 	try {
  //     console.log('expense main page:', expense);
	// 		 let message = "";
	// 			// if (expense.id === 0) {
	// 			// 		// New Category
	// 			// 		await insertCategory(category);
	// 			// 		message = "Dibuat!";
	// 			// } else {
	// 			// 		// Update Existing Category
	// 			// 		await updateCategory(category.id, category);
	// 			// 		message = "Diubah!";
	// 			// }

	// 			fetchExpenses(); // Refresh the Category list
	// 			setModalState(false); // Close the modal
	// 	} catch (error) {
	// 			console.error('Kesalahan dalam menyimpan: ', error);
	// 	}
	// };

  return (
    <Stack spacing={2}>
      <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }}>
        <InputLabel id="car-select-label">Pilih Mobil</InputLabel>
        <Select
          labelId="car-select-label"
          id="car-select"
          value={selectedVin}
          onChange={handleCarChange}
          label="Select a Car"
        >
          {cars.map((car) => (
            <MenuItem key={car.vin} value={car.vin}>
              {car.name} ({car.vin})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={()=>{openModal();}}  variant="contained">Catat Pengeluaran</Button>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Tanggal</StyledTableCell>
              <StyledTableCell>Keterangan</StyledTableCell>
              <StyledTableCell>Kategori</StyledTableCell>
              <StyledTableCell>Pengeluaran</StyledTableCell>
              <StyledTableCell>Biaya Oleh</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <StyledTableRow key={expense.id}>
                <StyledTableCell>
									{new Intl.DateTimeFormat('id-ID', {dateStyle: 'full',timeZone: 'Asia/Makassar',}).format(new Date(expense.created_at))}
									<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>
									{new Intl.DateTimeFormat('id-ID', {timeStyle: 'long', timeZone: 'Asia/Makassar',}).format(new Date(expense.created_at))}
									</Typography>
                </StyledTableCell>
                <StyledTableCell>{expense.description}</StyledTableCell>
                <StyledTableCell>{expense.category}
								</StyledTableCell>
                <StyledTableCell>
									{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(expense.amount)}
								</StyledTableCell>
                <StyledTableCell>{expense.company_expense? "Rental" : `${expense.vin} - ${expense.name}`  }</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ExpenseModal
				expense={emptyExpense}
        cars={cars}
				isModalOpen={isModalOpen} 
				onCloseModal={() => closeModal()}	
				onSaveExpense={handleSave} // Callback for saving
			/>
    </Stack>
  );
};

export default Expenses;
