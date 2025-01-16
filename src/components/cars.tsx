import React from "react";
import { useEffect, useState } from "react";
import { Actions, Car, CarTransaction, RentType, Transaction } from "../types/interfaceModels";
import { Box, Chip, Grid2 as Grid, Paper, Snackbar, Stack, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import CarRentalModal from "./carRentalModal";
import { getAllCars, updateCar } from "../services/carService";
import { addTransaction, getLatestTransactionByVinAndCompletedStatus, updateTransaction } from "../services/transactionService";
import { calculateUsageDurationAndCost } from "../helper/durationCalculator";

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
	rentType: Object.keys(RentType)[Object.values(RentType).indexOf(RentType.Daily)],
	fuelOut:"",
	fuelIn:"",
	expectedPayment:0,
	actualPayment:0,
	desc:"",
	completed:false
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
		const loadCars = async () => {
			setLoading(true);
			handleFetchCars();
			setCarTransaction(emptyCarTransaction);
			setLoading(false);
		};
		loadCars();
	}, []);

	const handleFetchCars = async () => {
		try {
			const data = await getAllCars();
			const sortedCar = data.sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name))
			setCars(sortedCar);
		} catch (error) {
			console.error('Error fetching products:', error);
			triggerSnack('Kesalahan dalam mengambil data mobil');
			alert(error);
		}
	};

	const handleUpdateCarTransaction = async (carTransaction: CarTransaction) => {
	 	 console.log(carTransaction);
		try {
			let message = "";
			//update car ready status
			await updateCar(carTransaction.car.vin, carTransaction.car);

			if(carTransaction.transaction.id===0){
				//create new transaction
				 await addTransaction(carTransaction.transaction);
			}
			else{
				//update transaction
				carTransaction.transaction.completed = true;
				await updateTransaction(carTransaction.transaction.id,carTransaction.transaction);
			}

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

	const openCarModal = async (car: Car, ready: boolean) => {
		let updatedTransaction:any;
		if(!ready){
			const data = await getLatestTransactionByVinAndCompletedStatus(car.vin, "false");
			updatedTransaction={
				...data,
				expectedPayment: calculateUsageDurationAndCost({car:car, transaction:data as Transaction}).totalCost
			}
		}
		else{
			updatedTransaction={
				...emptyTransaction,
				vin:car.vin,
				name:car.name,
				expectedPayment: car.dailyRate, // Set default expected payment to daily rate
				out:new Date()
			}
		}
		const act = car.ready? Actions.Out : Actions.In;
		setAction(act);

		const isReady = !ready;
		const updatedCar = {
			...car,
			ready: isReady,
		};

		setCarTransaction({car:updatedCar, transaction:updatedTransaction});
    setCarModalState(true);
  };

	const closeCarModal = () => {
		handleFetchCars();
    setCarModalState(false);
		setCarTransaction(emptyCarTransaction);
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
										<StyledTableCell align="right">Status</StyledTableCell>
									</TableRow>
								</TableHead>
								<TableBody>
								{cars.filter((car) =>
											car.vin.toLowerCase().includes(searchQuery.toLowerCase())
										).map((car) => (
									<StyledTableRow  key={car.id}>
										<StyledTableCell>
										{car.name} - {car.vin}
										<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>
											{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(car.dailyRate)} / Hari
										</Typography>
										</StyledTableCell>
										<StyledTableCell align="right">
										<Chip
											color={car.ready ? "success"  : "error" }
											label={car.ready ? "Ready" : "Keluar"}
											onClick={() => openCarModal(car, car.ready)}
										/>
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