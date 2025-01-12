import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Actions, CarTransaction, RentType } from "../types/interfaceModels";


interface carModalProps {
	carTransaction:CarTransaction;
	isModalOpen: boolean;
	action: Actions;
	onCloseModal: () => void;
	onUpdateCarTransaction: (carTransaction: CarTransaction) => void; // Callback for saving the car
	// onDeletecar: (car: car) => void; // Callback for saving the car
}

const CarRentalModal: React.FC<carModalProps> = ({
	carTransaction,
	isModalOpen,
	action,
	onCloseModal,
	onUpdateCarTransaction,
	// onDeletecar
}) => {

  const [localCarTransaction, setLocalCarTransaction] = useState<CarTransaction>(carTransaction); // Local state for the note

	useEffect(() => {
		setLocalCarTransaction(carTransaction); // Update localCar when the modal opens
	}, [carTransaction]);

	const handleAction = async () => {
		setLocalCarTransaction(localCarTransaction);
		onUpdateCarTransaction(localCarTransaction); // Call the save function passed from the parent
	};

	const handleChangeRentType = async (e: SelectChangeEvent<string>) => {
		setLocalCarTransaction({
      ...localCarTransaction,
      transaction: {
        ...localCarTransaction.transaction,
        rentType: e.target.value as RentType,
      },
    })
	}

return (
    <Dialog open={isModalOpen} onClose={onCloseModal} fullWidth={true}>
        <DialogTitle>{localCarTransaction.car.vin} - {localCarTransaction.car.name}</DialogTitle>
        <DialogContent>
					<Stack spacing={2}>
						<Stack spacing={2}>
								<TextField
									disabled={action===Actions.In}
									required
									margin="dense"
									id="renter_name"
									name="renter_name"
									label="Nama Pemakai"
									type="text"
									fullWidth
									variant="standard"
									value={localCarTransaction.transaction.renterName}
									onChange={(e: { target: { value: any; }; }) => setLocalCarTransaction({ ...localCarTransaction, transaction:{
										...localCarTransaction.transaction, renterName:e.target.value
									} })}
								/>
								<TextField
									disabled={action===Actions.In}
									margin="dense"
									id="renterPhone"
									name="renterPhone"
									label="No HP"
									type="text"
									fullWidth
									variant="standard"
									value={localCarTransaction.transaction.renterPhone}
									onChange={(e: { target: { value: any; }; }) => setLocalCarTransaction({ ...localCarTransaction, transaction:{
										...localCarTransaction.transaction, renterPhone:e.target.value
									} })}
								/>
								<TextField
									disabled={action===Actions.In}
									margin="dense"
									id="desc"
									name="desc"
									label="Keterangan"
									type="text"
									fullWidth
									variant="standard"
									value={localCarTransaction.transaction.desc}
									onChange={(e: { target: { value: any; }; }) => setLocalCarTransaction({ ...localCarTransaction, transaction:{
										...localCarTransaction.transaction, desc:e.target.value
									} })}
								/>
							</Stack>
						<Stack spacing={2} direction="row">
							<TextField
									disabled={action===Actions.In}
									margin="dense"
									id="fuelOut"
									name="fuelOut"
									label="BBM Keluar"
									type="text"
									fullWidth
									variant="standard"
									value={localCarTransaction.transaction.fuelOut}
									onChange={(e: { target: { value: any; }; }) => setLocalCarTransaction({ ...localCarTransaction, transaction:{
										...localCarTransaction.transaction, fuelOut:e.target.value
									} })}
								/>
								<TextField
									disabled={action===Actions.Out}
									margin="dense"
									id="fuelIn"
									name="fuelIn"
									label="BBM Masuk"
									type="text"
									fullWidth
									variant="standard"
									value={localCarTransaction.transaction.fuelIn}
									onChange={(e: { target: { value: any; }; }) => setLocalCarTransaction({ ...localCarTransaction, transaction:{
										...localCarTransaction.transaction, fuelIn:e.target.value
									} })}
								/>
						</Stack>
						<FormControl fullWidth variant="standard">
							<InputLabel id="rentType" autoFocus>Pemakaian</InputLabel>
							<Select
								disabled={action==Actions.In}
								required
								labelId="rentType"
								id="rentType"
								value={localCarTransaction.transaction.rentType || RentType.Daily}
								onChange={handleChangeRentType}
								>
									{Object.entries(RentType).map(([key, value]) => (
										<MenuItem key={key} value={key}>
											{value}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</Stack>
        </DialogContent>
        <DialogActions>
				<Button onClick={onCloseModal}>Batal</Button>
				<Button onClick={()=>handleAction()}>{`${action.toString()}`}</Button>
        </DialogActions>
    </Dialog>
	);
};

export default CarRentalModal;
