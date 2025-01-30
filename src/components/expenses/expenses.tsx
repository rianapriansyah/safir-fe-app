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
	styled,
	SelectChangeEvent,
	tableCellClasses,
	TableCell,
	TableRow,
	Typography,
} from '@mui/material';
import { Expense } from '../../types/interfaceModels';
import { getAllCars } from '../../services/carService';
import { getAllExpensesByVin } from '../../services/expenseService';

export interface Car {
  vin: string;
  name: string;
}

const Expenses: React.FC = () => {
	const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedVin, setSelectedVin] = useState<string>('');
  const [expenses, setExpenses] = useState<Expense[]>([]);

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
		const expenseData = await getAllExpensesByVin();
    console.log(expenseData);
    setExpenses(expenseData);
		isFetching = false;
	};

  const handleCarChange = async (e: SelectChangeEvent<string>) => {
    setSelectedVin(e.target.value as string);
  };

	const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  return (
    <React.Fragment>
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
			<Offset />
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
							<StyledTableCell>Id</StyledTableCell>
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
								<StyledTableCell>{expense.id} 
								</StyledTableCell>
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
                <StyledTableCell>{expense.car_specific? "Mobil" : "Rental"}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default Expenses;
