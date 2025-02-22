import { Card, CardActions, CardContent, FormControl, Grid2 as Grid, InputLabel,MenuItem, Paper, Select, SelectChangeEvent, Stack, Table, TableBody, TableContainer, TableHead, Typography  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { get_amount_by_filter, get_amount_per_car_by_filter } from '../../services/dashboardService';
import { Car, Expense, StaticFilter, Transaction } from '../../types/interfaceModels';
import Row from '../common/carTable';
import { getAllCars } from '../../services/carService';
import { StyledTableRow, StyledTableCell } from '../common/table';
import { getAllTransactionsByVin } from '../../services/transactionService';
import { formatDistance } from "date-fns";
import { id } from 'date-fns/locale/id'
import { getAllExpensesByVin } from '../../services/expenseService';


const CarDetails: React.FC = () => {
	const [cars, setCars] = useState<Car[]>([]);
	const [amount, setAmount] = useState<any>(0);
	const [details, setAmountDetail] = useState<any>([]);
	const [selectedFilter, setSelectedFilter] = useState<string>('this_year');
	const [selectedVin, setSelectedVin] = useState<string>('DN1260KJ');
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [expenses, setExpenses] = useState<Expense[]>([]);

	useEffect(() => {
		fetchHeaderAmount();
		fetchCarDetailAmount();
	}, [selectedFilter]);

	useEffect(() => {
		fetchCars();
	}, []);

	useEffect(() => {
		fetchTransactions();
	}, []);

	
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

	useEffect(() => {
		fetchExpenses();
	}, []);

	const fetchExpenses = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const expenseData = await getAllExpensesByVin('DN1260KJ');
		setExpenses(expenseData);
		isFetching = false;
	};
	
	const fetchHeaderAmount = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const data = await get_amount_by_filter(selectedFilter);
		setAmount(data);
		isFetching = false;
	};

	const fetchCarDetailAmount = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const data = await get_amount_per_car_by_filter(selectedFilter);
		setAmountDetail(data);
		isFetching = false;
	};

	const carType=[
		{
			id:"1",
			type:"internal",
			title:"Pemasukan Mobil Internal",
			cars:details.filter((car:any) => car.owned == true)
		},
		{
			id:"2",
			type:"external",
			title:"Pemasukan Mobil Eksternal",
			cars:details.filter((car:any) => car.owned == false)
		}
	];

	const handleFilterChange = async (e: SelectChangeEvent<string>) => {
    setSelectedFilter(e.target.value as string);
  };

	const handleCarChange = async (e: SelectChangeEvent<string>) => {
		setSelectedVin(e.target.value as string);
	};
	

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
			</Stack>
			<Card sx={{
				height: '100%'}}>
				<CardContent>
					<Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
						{`Gross Pemasukan Mobil Internal`}
					</Typography>
					
					<span>
					<Typography sx={{ color: 'text.secondary', mb: 1.5 }}>IDR
					</Typography>
					<Typography variant="h3" component="div">{new Intl.NumberFormat('id-ID').format(amount.total_internal_car_income)}</Typography>
					</span>		
					
				</CardContent>
				<CardActions>
				</CardActions>
			</Card>
			<Card sx={{
				height: '100%'}}>
				<CardContent>
					<Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
						{`Total Pengeluaran Oleh Rental`}
					</Typography>
					<span>
					<Typography sx={{ color: 'text.secondary', mb: 1.5 }}>IDR
					</Typography>
					<Typography variant="h3" component="div">{new Intl.NumberFormat('id-ID').format(amount.total_expense)}</Typography>
					</span>		
				</CardContent>
				<CardActions>
				</CardActions>
			</Card>
			<Card sx={{
				height: '100%'}}>
				<CardContent>
					<Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
						{`Nett`}
					</Typography>
					<span>
					<Typography sx={{ color: 'text.secondary', mb: 1.5 }}>IDR
					</Typography>
					<Typography variant="h3" component="div">{new Intl.NumberFormat('id-ID').format(amount.total_internal_car_income - amount.total_expense)}</Typography>
					</span>		
				</CardContent>
				<CardActions>
				</CardActions>
			</Card>
			<TableContainer component={Paper}>
				<Table aria-label="collapsible table" size="small">
				<TableBody>
					{carType.map((type) => (
						<Row key={type.id} row={type} />
					))}
				</TableBody>
				</Table>
			</TableContainer>
		 </Stack>
	 </Grid>
	);
};

export default CarDetails;
