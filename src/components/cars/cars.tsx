import React from "react";
import { useEffect, useState } from "react";
import { Actions, Car, CarTransaction, RentType, Transaction } from "../../types/interfaceModels";
import { Box, Button, Chip, Collapse, Grid2 as Grid, IconButton, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import CarRentalModal from "./carRentalModal";
import { getAllCarsWithLatestTransaction, updateCar } from "../../services/carService";
import { addTransaction, getLatestTransactionByVinAndCompletedStatus, updateTransaction } from "../../services/transactionService";
import { id } from "date-fns/locale";
import { format } from "date-fns";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { calculateUsageDurationAndCost } from "../../helper/durationCalculator";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import QrCodeIcon from '@mui/icons-material/QrCode';

const emptyCar:any={
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
	dp:0,
	actualPayment:0,
	desc:"",
	completed:false
}

const emptyCarTransaction: CarTransaction = {
  car: emptyCar,
  transaction: emptyTransaction,
};

const CarList: React.FC = () => {
	const [cars, setCars] = useState<any[]>([]);
	const [loading, _setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [isCarModalOpen, setCarModalState] = useState(false); // Product Modal state
	const [selectedCarTransaction, setCarTransaction] = useState<CarTransaction>(emptyCarTransaction);
	const [postMessage, setMessage] = useState(""); 
	const [openSnack, setOpenSnack] = React.useState(false);
	const handleCloseSnack = () => setOpenSnack(false);
	const [action, setAction] = useState<Actions>(Actions.Out);
	

	useEffect(() => {
		handleFetchCars();
		setCarTransaction(emptyCarTransaction);
	}, []);

	const handleFetchCars = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const data = await getAllCarsWithLatestTransaction();
		const sortedCar = data.sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name));
		console.log(sortedCar);
		setCars(sortedCar);
		isFetching = false;
	};

	const handleUpdateCarTransaction = async (carTransaction: CarTransaction) => {
	 	//console.log(carTransaction);
		try {
			let message = "";
			await updateCar(carTransaction.car.vin, carTransaction.car.ready);
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

	const openCarModal = async (car: Car, ready: boolean) => {
		let updatedTransaction:any;
		if(!ready){
			const data = await getLatestTransactionByVinAndCompletedStatus(car.vin, "false");
			updatedTransaction={
				...data
			}
		}
		else{
			updatedTransaction={
				...emptyTransaction,
				vin:car.vin,
				name:car.name,
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

	const formatWhatsAppLink = (number: string) => {
		const cleanedNumber = number.replace(/[^0-9]/g, "");
		if (cleanedNumber.startsWith("0")) {
			return `https://wa.me/62${cleanedNumber.slice(1)}`;
		}
	};

	const openWhatsApp = (number: string) => {
    const waLink = formatWhatsAppLink(number);
    window.open(waLink, "_blank");
  };

	function Row(props: { row: any }) {
		const { row } = props;
		const [open, setOpen] = React.useState(false);
	
		return (
			<React.Fragment>
				<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
					<TableCell>
						<IconButton
							aria-label="expand row"
							size="small"
							onClick={() => setOpen(!open)}
						>
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					</TableCell>
					<TableCell component="th" scope="row">
						{row.name} - {row.vin}
						<IconButton onClick={()=>window.open(row.qr_link, "_blank")}>
							<QrCodeIcon  /> 
						</IconButton>
					</TableCell>
					<TableCell align="right">
					<Chip size="small"
										color={row.ready ? "success"  : "error" }
										label={row.ready ? "Ready" : "Keluar"}
										// onClick={() => openCarModal(row, row.ready)}
									/>
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
						<Collapse in={open} timeout="auto" unmountOnExit>
							<Box sx={{ margin: 1 }}>
								<Typography variant="h6" gutterBottom component="div">
									Info Pemakaian
								</Typography>
								<Table size="small" aria-label="purchases">
                {/* <TableHead>
                  <TableRow>
                    <TableCell>Tanggal Pengambilan</TableCell>
                    <TableCell>Pemakai</TableCell>
                    <TableCell align="right">Tarif Perhari</TableCell>
                    <TableCell align="right">Tagihan Berjalan</TableCell>
                  </TableRow>
                </TableHead> */}
                <TableBody>
									<TableRow key="1">
										<TableCell scope="row">
										{row.completed ? 
										`Pemakaian terakhir, ${format(new Date(row.in), "EEEE, dd MMMM yyyy, HH:mm", { locale: id })}` : 
										`${format(new Date(row.out), "EEEE, dd MMMM yyyy, HH:mm", { locale: id })}`
										}
										</TableCell>
									</TableRow>
									{!row.completed && row.renter_phone !== "" && (
										<React.Fragment>
											<TableRow key="2">
												<TableCell component="th" scope="row">
													<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Pemakai</Typography>
													{row.renter_name}
													<IconButton onClick={() => openWhatsApp(row.renter_phone)}>
														<WhatsAppIcon />
													</IconButton>
												</TableCell>
											</TableRow>
											<TableRow key="3">
													<TableCell component="th" scope="row">
														<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Tagihan</Typography>
														{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(calculateUsageDurationAndCost(row, row).totalCost)}
													</TableCell>
											</TableRow>
										</React.Fragment>
									)}
									<TableRow key="3">
										<TableCell component="th" scope="row">
											<Button variant="contained" size="small" onClick={() => openCarModal(row, row.ready)}
												color={row.ready ? "success"  : "error" }
												>
												{row.ready ? "Keluarkan" : "Masukkan"} {row.name} - {row.vin}
											</Button>
										</TableCell>
									</TableRow>
                </TableBody>
              </Table>
							</Box>
						</Collapse>
					</TableCell>
				</TableRow>
			</React.Fragment>
		);
	}

	return (
		<Box component="section" sx={{ flexGrow:1, p: 1,borderRadius:"10px" }}>
			<Grid container rowSpacing={1} spacing={{ xs: 2, md: 2 }} columns={{ xs: 1, sm: 1, md: 12 }}>
				<Grid size={12}>
				<Stack spacing={2}>
					<Typography variant="h4" gutterBottom>
							Daftar Mobil
					</Typography>
					<TextField id="outlined-basic" label="Search products..." variant="outlined" onChange={(e) => setSearchQuery(e.target.value)}/>
					<Stack direction={"row"} spacing={2}>
						<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Total Mobil :{' '}
							{cars.filter((car) => car.name.toLowerCase().includes(searchQuery.toLowerCase())).length}
						</Typography>
					</Stack>
					<TableContainer component={Paper}>
						<Table aria-label="collapsible table">
							<TableHead>
								<TableRow>
									<TableCell width={'1%'}/>
									<TableCell align="left">Mobil</TableCell>
									<TableCell align="right">Status</TableCell>
								</TableRow>
						</TableHead>
						<TableBody>
							{cars.filter((car) => car.vin.toLowerCase().includes(searchQuery.toLowerCase())).map((car) => (
								<Row key={car.vin} row={car} />
							))}
						</TableBody>
						</Table>
					</TableContainer>
					</Stack>
				</Grid>
			</Grid>
			
			<CarRentalModal
				carTransaction={selectedCarTransaction}
				isModalOpen={isCarModalOpen} 
				onCloseModal={() => closeCarModal()}	
				onUpdateCarTransaction={handleUpdateCarTransaction} 
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