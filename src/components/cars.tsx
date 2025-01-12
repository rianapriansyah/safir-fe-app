import React from "react";
import { useEffect, useState } from "react";
import { Actions, Car, CarTransaction, Transaction } from "../types/interfaceModels";
import { Box, Chip, Grid2 as Grid, Paper, Snackbar, Stack, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CarRentalModal from "./carRentalModal";
import { createTransaction, fetchCars, updateCar } from "../api/apiCalls";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

const emptyCar:Car={
	id: 0,
	vin: "",
	name: "",
	owned: false,
	dailyRate: 0,
	threeHourRate: 0,
	ready: false,
	monthlyRate: 0
};

const emptyTransaction:Transaction={
	id: 0,
	vin:"",
	name:"",
	renterName:"",
	renterPhone:"",
	out:new Date(),
	in:new Date(),
	rentType:"",
	fuelOut:"",
	fuelIn:"",
	expectedPayment:0,
	actualPayment:0,
	desc:"",
}

const emptyCarTransaction: CarTransaction = {
  car: emptyCar,
  transaction: emptyTransaction,
};

const CarList: React.FC = () => {
	const [cars, setCars] = useState<Car[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [isCarModalOpen, setCarModalState] = useState(false); // Product Modal state
	const [selectedCarTransaction, setCarTransaction] = useState<CarTransaction>(emptyCarTransaction);
	const [postMessage, setMessage] = useState(""); 
	const [openSnack, setOpenSnack] = React.useState(false);
	const handleCloseSnack = () => setOpenSnack(false);
	const [action, setAction] = useState<Actions>(Actions.Out);

	useEffect(() => {
		const loadProducts = async () => {
			setLoading(true);
			handleFetchCars();
			setLoading(false);
		};

		loadProducts();
	}, []);

	const handleFetchCars = async () => {
		try {
			const data = await fetchCars();
			const sortedCar = data.data.sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name))
			setCars(sortedCar);

			// const test = await fetchTransactions();
			// console.log(test);
			// setCarTransaction({
			// 	car: emptyCar,
			// 	transaction: emptyTransaction,
			// });
		} catch (error) {
			console.error('Error fetching products:', error);
			triggerSnack('Kesalahan dalam mengambil data mobil');
			alert(error);
		}
	};

	const handleUpdateCarTransaction = async (carTransaction: CarTransaction) => {
		//console.log(carTransaction);
		
		try {
			let message = "";

			//update car ready status
			await updateCar(carTransaction.car.vin, carTransaction.car);

			//create new transaction
			await createTransaction(carTransaction.transaction);

			message = "Diubah!";
			handleFetchCars(); // Refresh the product list
			setCarModalState(false); // Close the modal
			triggerSnack(`${carTransaction.car.name} ${message}`);
		} catch (error) {
			console.error('Error saving product:', error);
			triggerSnack(`Error saving product-${carTransaction.car.name}`);
		}
	};

	if (loading) return <p>Loading...</p>;

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

	const openCarModal = (car: Car, ready: boolean) => {
		const act = car.ready? Actions.Out : Actions.In;
		setAction(act);

		const isReady = !ready;
		const updatedCar = {
			...car,
			ready: isReady,
		};

		const updatedTransaction={
			...emptyTransaction,
			vin:car.vin,
			name:car.name
		}

		setCarTransaction({car:updatedCar, transaction:updatedTransaction});
    setCarModalState(true);
  };

	// const closeProductModal = () => {
	// 	handleFetchProduct();
  //   setProductModalState(false);
  // };

	const closeCarModal = () => {
		handleFetchCars();
    setCarModalState(false);
  };

	const triggerSnack = (msg:string) => {
    setMessage(msg);
    setOpenSnack(true);
  };

	return (
		<Box component="section" sx={{ flexGrow:1, p: 1,borderRadius:"10px" }}>
			<Grid container rowSpacing={1} spacing={{ xs: 2, md: 2 }} columns={{ xs: 1, sm: 1, md: 12 }}>
				<Grid size={12}>
				<Stack spacing={2}>
					<Typography variant="h4" gutterBottom>
							Daftar Mobil
					</Typography>
					{/* <Button onClick={()=>{openProductModal(emptyProduct, Actions.Add);}} variant="contained">Tambah Produk Baru</Button> */}
					<TextField id="outlined-basic" label="Search products..." variant="outlined" onChange={(e) => setSearchQuery(e.target.value)}/>
					<Stack direction={"row"} spacing={2}>
						<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Total Mobil :{' '}
							{cars.filter((car) => car.name.toLowerCase().includes(searchQuery.toLowerCase())).length}
						</Typography>
					</Stack>
					<Box sx={{
						mb: 2,
						display: "flex",
						flexDirection: "column",
						height: "inherit"
						// justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
						}}>
						<TableContainer component={Paper}>
							<Table size='small'>
								<TableHead>
									<TableRow>
										<StyledTableCell>Mobil</StyledTableCell>
										<StyledTableCell>Status</StyledTableCell>
										<StyledTableCell align="right">Aksi</StyledTableCell>
									</TableRow>
								</TableHead>
								<TableBody>
								{cars.filter((car) =>
											car.vin.toLowerCase().includes(searchQuery.toLowerCase())
										).map((car) => (
									<StyledTableRow  key={car.id}>
										<StyledTableCell>
											{car.vin} - {car.name}
										<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>{car.dailyRate}</Typography>
										</StyledTableCell>
										<StyledTableCell>
										{car.ready? <Chip icon={<LoginIcon color="success"/>} label="Ready" />  :<Chip icon={<LogoutIcon color="error"/>} label="Keluar" />}
										</StyledTableCell>
										
										<StyledTableCell align="right">
											<ToggleButtonGroup
											color="primary"
												size='small'
												exclusive
												aria-label="action button"
											>                   
												<ToggleButton value="update" onClick={() => openCarModal(car, car.ready)}>
													<EditIcon  />
												</ToggleButton>
											</ToggleButtonGroup>
										</StyledTableCell>
									</StyledTableRow >
									))}
								</TableBody>
							</Table>
						</TableContainer>
        	</Box>
					</Stack>
				</Grid>
				<Grid size={6}>
				</Grid>
			</Grid>
			
			<CarRentalModal
				carTransaction={selectedCarTransaction}
				isModalOpen={isCarModalOpen} 
				onCloseModal={() => closeCarModal()}	
				onUpdateCarTransaction={handleUpdateCarTransaction} // Callback for saving product
				// onDeleteCategory={handleDeleteCategory} // Callback for saving product
				action={action}
			/>
			<Snackbar
        autoHideDuration={4000}
        anchorOrigin={{vertical: 'top', horizontal: 'center' }}
        open={openSnack}
        onClose={handleCloseSnack}
        message={postMessage}
      />
		</Box>
	);
};

export default CarList;