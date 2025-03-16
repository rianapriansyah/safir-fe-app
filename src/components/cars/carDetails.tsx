import { Box, FormControl, Grid2 as Grid, InputLabel,MenuItem, Paper, Select, SelectChangeEvent, Stack, Tab, Table, TableBody, TableContainer, TableHead, Tabs, Typography  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { get_amount_per_car_by_vin } from '../../services/dashboardService';
import { Car, CarBalance, Expense, StaticFilter, Transaction } from '../../types/interfaceModels';
import { getAllCars } from '../../services/carService';
import { StyledTableRow, StyledTableCell } from '../common/table';
import { getAllTransactionsByVin } from '../../services/transactionService';
import { formatDistance } from "date-fns";
import { id } from 'date-fns/locale/id'
import { getAllExpensesByVin } from '../../services/expenseService';
import { get_balance_by_vin } from '../../services/carBalanceService';
import SummaryText from '../common/summaryText';


const CarDetails: React.FC = () => {
	const [cars, setCars] = useState<Car[]>([]);
	const [details, setAmountDetail] = useState<any>([]);
	const [selectedFilter, setSelectedFilter] = useState<string>('this_year');
	const [selectedVin, setSelectedVin] = useState<string>('DN1260KJ');
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [balances, setBalances] = useState<CarBalance[]>([]);

	useEffect(() => {
		fetchCarDetailAmount();
	}, [selectedVin]);

	useEffect(() => {
		fetchCars();
	}, [selectedVin]);

	useEffect(() => {
		fetchTransactions();
	}, [selectedVin]);

	useEffect(() => {
		fetchExpenses();
	}, [selectedVin]);

	useEffect(() => {
		fetchBalances();
	}, [selectedVin]);

	
	const fetchCars = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const carData = await getAllCars();
		setCars(carData);
		isFetching = false;
	};

	const fetchTransactions = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const data = await getAllTransactionsByVin(selectedVin);
		setTransactions(data);
		isFetching = false;
	};

	const fetchExpenses = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const expenseData = await getAllExpensesByVin(selectedVin);
		setExpenses(expenseData);
		isFetching = false;
	};

	const fetchBalances = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const balanceData = await get_balance_by_vin(selectedVin);
		setBalances(balanceData);
		isFetching = false;
	};

	const fetchCarDetailAmount = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const data = await get_amount_per_car_by_vin(selectedFilter, selectedVin);
		setAmountDetail(data);
		isFetching = false;
	};

	const handleFilterChange = async (e: SelectChangeEvent<string>) => {
    setSelectedFilter(e.target.value as string);
  };

	const handleCarChange = async (e: SelectChangeEvent<string>) => {
		setSelectedVin(e.target.value as string);
	};
	
	const [value, setValue] = React.useState(0);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

	interface TabPanelProps {
		children?: React.ReactNode;
		index: number;
		value: number;
	}

	function CustomTabPanel(props: TabPanelProps) {
		const { children, value, index, ...other } = props;

		return (
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`simple-tabpanel-${index}`}
				aria-labelledby={`simple-tab-${index}`}
				{...other}
			>
				{value === index && <Box sx={{ marginTop:3 }}>{children}</Box>}
			</div>
		);
	}

return (
   <Grid>
		 <Stack spacing={2}>
		 	<Stack spacing={2} direction={'row'}>
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
			<FormControl variant="outlined" style={{ marginBottom: '16px' }} fullWidth>
        <InputLabel id="car-select-label">Pilih Filter</InputLabel>
        <Select
          labelId="car-select-label"
          id="car-select"
          value={selectedFilter}
          onChange={handleFilterChange}
          label="Terapkan Filter"
        >
          {StaticFilter.map((filter) => (
            <MenuItem key={filter.id} value={filter.key}>
              {filter.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
			</Stack>
			<SummaryText owned={cars.find((x) => x.vin === selectedVin)?.owned ?? false} total_income={details.total_income} total_expense={details.total_expense} profit_sharing_amount={details.profit_sharing_amount}/>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable">
					<Tab label="Detail Mobil" />
					<Tab label="Saldo" />
					<Tab label="Transaksi Masuk/Keluar" />
				</Tabs>
			</Box>
			<CustomTabPanel value={value} index={0}>
        
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				
			</CustomTabPanel>
			<CustomTabPanel value={value} index={2}>
				
			</CustomTabPanel>
			<TableContainer component={Paper} sx={{ height: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <StyledTableRow>
							<StyledTableCell>Tanggal</StyledTableCell>
							<StyledTableCell>Jenis</StyledTableCell>
              <StyledTableCell>Nominal</StyledTableCell>
              <StyledTableCell>Referensi</StyledTableCell>
              <StyledTableCell>Keterangan</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {balances.map((balance) => (
              <StyledTableRow key={balance.id}>
								<StyledTableCell>{new Intl.DateTimeFormat('id-ID', {dateStyle: 'full',timeZone: 'Asia/Makassar',}).format(new Date(balance.created_at))}</StyledTableCell>
								<StyledTableCell>{balance.transaction_type}</StyledTableCell>
                <StyledTableCell>{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(balance.amount)}
								</StyledTableCell>
                <StyledTableCell>{balance.reference_id}
								</StyledTableCell>
                <StyledTableCell>{balance.description}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
			<Stack spacing={2} direction={'row'}>
			<TableContainer component={Paper} sx={{ height: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <StyledTableRow>
							<StyledTableCell>Durasi</StyledTableCell>
              <StyledTableCell>Nama Pemakai</StyledTableCell>
              <StyledTableCell>Pemasukkan</StyledTableCell>
              <StyledTableCell>Keterangan</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <StyledTableRow key={transaction.id}>
								<StyledTableCell>{formatDistance(new Date(transaction.out), new Date(transaction.in), {locale:id})}
								</StyledTableCell>
                <StyledTableCell>{transaction.renterName}
									<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>
										{transaction.renterPhone}
									</Typography>
								</StyledTableCell>
                <StyledTableCell>
									{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(transaction.dp + transaction.actualPayment)}
								</StyledTableCell>
                <StyledTableCell>{transaction.desc}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
			<TableContainer component={Paper} sx={{ height: 600 }}>
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
			</Stack>
		 </Stack>
	 </Grid>
	);
};

export default CarDetails;
