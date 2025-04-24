import { Box, FormControl, Grid2 as Grid, InputLabel,MenuItem, Select, SelectChangeEvent, Stack, Tab, Tabs  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { get_amount_per_car_by_vin } from '../../services/dashboardService';
import { Car, StaticFilter } from '../../types/interfaceModels';
import { getAllCars } from '../../services/carService';
import SummaryText from '../common/summaryText';
import Balance from './balance';
import TransactionHistory from './transactionHistory';
import ExpenseHistory from './expenseHistory';


const CarDetails: React.FC = () => {
	const [cars, setCars] = useState<Car[]>([]);
	const [details, setAmountDetail] = useState<any>([]);
	const [selectedFilter, setSelectedFilter] = useState<string>('this_year');
	const [selectedVin, setSelectedVin] = useState<string>('DN1260KJ');

	useEffect(() => {
		fetchCarDetailAmount();
	}, [selectedVin]);

	useEffect(() => {
		fetchCars();
	}, [selectedVin]);
	
	const fetchCars = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const carData = await getAllCars();
		setCars(carData);
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
					<Tab label="Riwayat Pemakaian" />
					<Tab label="Riwayat Pengeluaran" />
				</Tabs>
			</Box>
			<CustomTabPanel value={value} index={0}>
        
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<Balance selectedVin={selectedVin}/>
			</CustomTabPanel>
			<CustomTabPanel value={value} index={2}>
				<TransactionHistory selectedVin={selectedVin}/>
			</CustomTabPanel>
			<CustomTabPanel value={value} index={2}>
				<ExpenseHistory selectedVin={selectedVin}/>
			</CustomTabPanel>
		 </Stack>
	 </Grid>
	);
};

export default CarDetails;
