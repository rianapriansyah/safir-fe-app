import { Card, CardActions, CardContent, FormControl, Grid2 as Grid, InputLabel,MenuItem, Paper, Select, SelectChangeEvent, Stack, Table, TableBody, TableContainer, Typography  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { get_amount_by_filter, get_amount_per_car_by_filter } from '../../services/dashboardService';
import { StaticFilter } from '../../types/interfaceModels';
import Row from '../common/carTable';


const Dashboard: React.FC = () => {
	const [amount, setAmount] = useState<any>(0);
	const [details, setAmountDetail] = useState<any>([]);
	const [selectedFilter, setSelectedFilter] = useState<string>('this_year');

	useEffect(() => {
		fetchHeaderAmount();
		fetchCarDetailAmount();
	}, [selectedFilter]);

	

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
	

return (
   <Grid>
		 <Stack spacing={2}>
		 <FormControl variant="outlined" style={{ marginBottom: '16px' }}>
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

export default Dashboard;
