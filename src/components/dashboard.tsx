import { Grid2 as Grid, List, ListItem, ListItemText, styled, Typography  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getCarsWithIncomeByType, getSumActualIncomeByCarType } from '../services/dashboardService';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';


const Dashboard: React.FC = () => {

	const [intCarIncome, setInternalCarsIncome] = useState<any>(0);
	const [extCarIncome, setExtCarIncome] = useState<any>(0);
	const [expanded, setExpanded] = React.useState<string | false>('');
	const [internalCars, setInternalCars] = useState<any[]>([]);
	const [externalCars, setExternalCars] = useState<any[]>([]);

	useEffect(() => {
		fetchIntCarIncome();
		fetchExtCarIncome();
		fetchInternalCars();
		fetchExternalCars();
	}, []);

	const fetchIntCarIncome = async () => {
		try {
			const data = await getSumActualIncomeByCarType(true);
			setInternalCarsIncome(data);
		} catch (error) {
			console.error('Error fetching products:', error);
		}
	};

	const fetchExtCarIncome = async () => {
		try {
			const data = await getSumActualIncomeByCarType(false);
			setExtCarIncome(data);
		} catch (error) {
			console.error('Error fetching products:', error);
		}
	};

	const fetchInternalCars = async () => {
		try {
			const data = await getCarsWithIncomeByType(true);
			setInternalCars(data);
		} catch (error) {
			console.error('Error fetching products:', error);
		}
	};

	const fetchExternalCars = async () => {
		try {
			const data = await getCarsWithIncomeByType(false);
			setExternalCars(data);
		} catch (error) {
			console.error('Error fetching products:', error);
		}
	};

	const carType=[
		{
			id:"1",
			type:"internal",
			title:"Pemasukan Mobil Internal",
			income: new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(intCarIncome.total_income),
			cars:internalCars
		},
		{
			id:"2",
			type:"external",
			title:"Pemasukan Mobil Eksternal",
			income: new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(extCarIncome.total_income),
			cars:externalCars
		}
	];

	const handleChange = (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const Accordion = styled((props: AccordionProps) => (
		<MuiAccordion disableGutters elevation={0} square {...props}  />
	))(({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&::before': {
			display: 'none',
		},
	}));
	
	const AccordionSummary = styled((props: AccordionSummaryProps) => (
		<MuiAccordionSummary 
			expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
			{...props}
		/>
	))(({ theme }) => ({
		backgroundColor: 'rgba(0, 0, 0, .03)',
		flexDirection: 'row-reverse',
		[`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
			{
				transform: 'rotate(90deg)',
			},
		[`& .${accordionSummaryClasses.content}`]: {
			marginLeft: theme.spacing(1),
		},
		...theme.applyStyles('dark', {
			backgroundColor: 'rgba(255, 255, 255, .05)',
		}),
	}));
	
	const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
		padding: theme.spacing(2),
		borderTop: '1px solid rgba(0, 0, 0, .125)',
		textAlign: "left"
	}));

return (
   <Grid>
		<List>
			{carType.map((type) => (
				<Accordion expanded={expanded === type.id} onChange={handleChange(type.id)} key={type.id} >
				<AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
					<Typography component="span" sx={{ width: '90%' }}>
					{type.title}
					</Typography>
					<Typography component="span" sx={{ width: '90%' }}>
						{type.income}
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
				<List sx={{ bgcolor: 'background.paper' }}>
					{type.cars.map((car) => (
						<ListItem
							key={car.vin}
							secondaryAction={<React.Fragment>
								<Typography variant="button" gutterBottom>
								{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(car.total_actual_payment)}	
								</Typography>
							</React.Fragment>}
						>
							<ListItemText primary={car.vin} secondary={car.car_name} />
						</ListItem>
					))}
					</List>
				</AccordionDetails>
				</Accordion>
			))}
		</List>
	 </Grid>
	);
};

export default Dashboard;
