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
import { Transaction } from '../types/interfaceModels';
import { getAllCars } from '../services/carService';
import { getAllTransactionsByVin, getCountAllPaymentMadeByCar } from '../services/transactionService';

export interface Car {
  vin: string;
  name: string;
}

const ListTransactions: React.FC = () => {
	const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedVin, setSelectedVin] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<any>();

  // Fetch car list on mount
  useEffect(() => {
    const loadCars = async () => {
      try {
        const carData = await getAllCars();
        setCars(carData);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };
    loadCars();
  }, []);

  // Fetch transactions when a car is selected
  useEffect(() => {
    if (selectedVin) {
      const loadTransactions = async () => {
        try {
          const transactionData = await getAllTransactionsByVin(selectedVin);
          setTransactions(transactionData);
          const paymentSummaryData = await getCountAllPaymentMadeByCar(selectedVin);
          setPaymentSummary(paymentSummaryData)
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      };
      loadTransactions();
    }
  }, [selectedVin]);

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
      <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>
        Transaksi aktual tercatat {new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format((paymentSummary?.adjusted_total_actual_payment))}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>
        Fee Transaksi {new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(paymentSummary?.transaction_fee)}
      </Typography>
			<Offset />
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
							<StyledTableCell>Keluar</StyledTableCell>
              <StyledTableCell>Masuk</StyledTableCell>
              <StyledTableCell>Nama Pemakai</StyledTableCell>
              <StyledTableCell>DP</StyledTableCell>
              <StyledTableCell>Diterima</StyledTableCell>
              <StyledTableCell>Dana Masuk</StyledTableCell>
              <StyledTableCell>Keterangan</StyledTableCell>
							<StyledTableCell>Status</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <StyledTableRow key={transaction.id}>
								<StyledTableCell>{new Intl.DateTimeFormat('id-ID', {dateStyle: 'full',timeZone: 'Asia/Makassar',}).format(new Date(transaction.out))}
								<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>
									{new Intl.DateTimeFormat('id-ID', {timeStyle: 'long', timeZone: 'Asia/Makassar'}).format(new Date(transaction.out))} 
								</Typography>
								</StyledTableCell>
								
                <StyledTableCell>
									{transaction.completed ? new Intl.DateTimeFormat('id-ID', {dateStyle: 'full',timeZone: 'Asia/Makassar',}).format(new Date(transaction.in)) : ""}
									<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>
									{transaction.completed ? new Intl.DateTimeFormat('id-ID', {timeStyle: 'long', timeZone: 'Asia/Makassar',}).format(new Date(transaction.in)) : ""}
									</Typography>

                </StyledTableCell>
                <StyledTableCell>{transaction.renterName}
									<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>
										{transaction.renterPhone}
									</Typography>
								</StyledTableCell>
                <StyledTableCell>
									{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(transaction.dp)}
								</StyledTableCell>
                <StyledTableCell>
									{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(transaction.actualPayment)}
								</StyledTableCell>
                <StyledTableCell>
									{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(transaction.dp + transaction.actualPayment)}
								</StyledTableCell>
                <StyledTableCell>{transaction.desc}</StyledTableCell>
								<StyledTableCell>{transaction.completed? "Selesai":"Belum selesai"}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default ListTransactions;
