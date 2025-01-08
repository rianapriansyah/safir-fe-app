import React from "react";
import { useEffect, useState } from "react";
import { Actions, Car } from "../types/interfaceModels";
import { Box, Grid2 as Grid, Paper, Snackbar, Stack, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CarRentalModal from "./carRentalModal";
import { fetchCars } from "../api/apiCalls";

const availableCars:Car[]=[
	{
		id: 1,
		vin: "DN1349",
		name: "Veloz Putih",
		owned: true,
		dailyRate: 350000,
		threeHourRate: 150000,
		ready: true,
		monthlyRate: 0
	},
	{
		id: 2,
		vin: "DN1521",
		name: "Rush Maroon",
		owned: false,
		dailyRate: 350000,
		threeHourRate: 150000,
		ready: true,
		monthlyRate: 0
	},
	{
		id: 3,
		vin: "DN1677JK",
		name: "Avanza Gray",
		owned: true,
		dailyRate: 300000,
		threeHourRate: 100000,
		ready: true,
		monthlyRate: 0
	},
];

const CarList: React.FC = () => {
	const [cars, setCars] = useState<Car[]>(availableCars);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [isCarModalOpen, setCarModalState] = useState(false); // Product Modal state
	const [selectedCar, setSelectedCar] = useState<Car>(availableCars[0]);
	const [postMessage, setMessage] = useState(""); 
	const [openSnack, setOpenSnack] = React.useState(false);
	const handleCloseSnack = () => setOpenSnack(false);
	const [action, setAction] = useState<Actions>(Actions.Out);

	useEffect(() => {
		const loadProducts = async () => {
			setLoading(true);
			handleFetchCar();
			setLoading(false);
		};

		loadProducts();
	}, []);

	const handleFetchCar = async () => {
		try {
			const data = await fetchCars();
			setCars(data.data);
		} catch (error) {
			console.error('Error fetching products:', error);
			triggerSnack('Kesalahan dalam mengambil data mobil');
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

	const openCarModal = (car:Car, ) => {
		setAction(action);
		setSelectedCar(car);
    setCarModalState(true);
  };

	// const openCategoryModal = (category:Category, action:Actions) => {
	// 	setAction(action);
	// 	setSelectedCategory(category);
  //   setCategoryModalState(true);
  // };

	// const closeProductModal = () => {
	// 	handleFetchProduct();
  //   setProductModalState(false);
  // };

	const closeCarModal = () => {
		handleFetchCar();
    setCarModalState(false);
  };

	const triggerSnack = (msg:string) => {
    setMessage(msg);
    setOpenSnack(true);
  };

	return (
		<Grid>
		<Box component="section" sx={{ flexGrow:1, p: 2, border: '1px dashed grey', borderRadius:"10px" }}>
			<Grid container rowSpacing={1} spacing={{ xs: 2, md: 2 }} columns={{ xs: 1, sm: 1, md: 12 }}>
				<Grid size={6}>
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
										<StyledTableCell>Harian</StyledTableCell>
										<StyledTableCell align="right">Aksi</StyledTableCell>
									</TableRow>
								</TableHead>
								<TableBody>
								{cars.filter((car) =>
											car.name.toLowerCase().includes(searchQuery.toLowerCase())
										).map((car) => (
									<StyledTableRow  key={car.id}>
										<StyledTableCell>
											{car.name}
										<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>{car.vin}</Typography>
										</StyledTableCell>
										<StyledTableCell>
											{car.dailyRate}
										</StyledTableCell>
										
										<StyledTableCell align="right">
											<ToggleButtonGroup
											color="primary"
												size='small'
												exclusive
												aria-label="action button"
											>                   
												<ToggleButton value="update" onClick={() => openCarModal(car)}>
													<EditIcon  />
												</ToggleButton>
												{/* <ToggleButton value="delete" onClick={() => openProductModal(product, Actions.Delete)}>
													<DeleteIcon  />
												</ToggleButton> */}
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
				car={selectedCar}
				isModalOpen={isCarModalOpen} 
				onCloseModal={() => closeCarModal()}	
				// onSaveCategory={handleSaveCategory} // Callback for saving product
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
		</Grid>
	);
};

export default CarList;