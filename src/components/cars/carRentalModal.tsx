import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Actions, CarTransaction, formatSavedTransactionOut, generate12HourTimes } from "../../types/interfaceModels";
import { formatDistanceToNow, format } from "date-fns";
import { id } from 'date-fns/locale'
import { calculateUsageDurationAndCost } from '../../helper/durationCalculator';

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
  const [times, setTimes] = useState<any[]>([]); // Local state for the times
	const [selectedTime, setSelectedTime] = useState("");

	useEffect(() => {
		setLocalCarTransaction(carTransaction); // Update localCar when the modal opens
		setTimes(generate12HourTimes());
		setSelectedTime(formatSavedTransactionOut(carTransaction.transaction.out));
	}, [carTransaction]);

	const handleAction = async () => {
		const updatedTransaction = { ...localCarTransaction };

		if(localCarTransaction.transaction.dp===0 && localCarTransaction.transaction.actualPayment===0&&action===Actions.In){
			updatedTransaction.transaction.paid = false;
		}
		else if(action===Actions.In){
			updatedTransaction.transaction.paid = true;
		}
		
		setLocalCarTransaction(updatedTransaction);
		onUpdateCarTransaction(updatedTransaction); // Call the save function passed from the parent
	};

	const handleChangeTime = async (e: SelectChangeEvent<string>) => {
		const [time, period] = e.target.value.split(" "); // Split into hour and AM/PM
    const hour = parseInt(time); // Extract the hour
    const isPM = period === "PM";

    const now = new Date(); // Get the current date
    now.setSeconds(0); // Reset seconds
    now.setMilliseconds(0); // Reset milliseconds

    // Convert to 24-hour format and set the time
    const adjustedHour = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
    now.setHours(adjustedHour, 0, 0, 0); // Set the hour and reset minutes, seconds, and milliseconds

		setLocalCarTransaction({
      ...localCarTransaction,
      transaction: {
        ...localCarTransaction.transaction,
        out: now,
      },
    })

		setSelectedTime(e.target.value);
	}

return (
    <Dialog open={isModalOpen} onClose={onCloseModal} fullWidth={true}>
        <DialogTitle>{localCarTransaction.car.name} - {localCarTransaction.car.vin}</DialogTitle>
        <DialogContent>
					<Stack spacing={2} >
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
							<InputLabel id="rentType" autoFocus>Keluar Jam</InputLabel>
							<Select
								disabled={action==Actions.In}
								required
								labelId="rentType"
								id="rentType"
								value={selectedTime}
								onChange={handleChangeTime}
								displayEmpty
								>
									{times.map((time) => (
										<MenuItem key={time.id} value={time.time}>
											{time.time} 
										</MenuItem>
									))}
							</Select>
						</FormControl>
						<Stack spacing={2} direction="row">
								<TextField
									disabled={action===Actions.In}
									margin="dense"
									id="dp"
									name="dp"
									label="DP"
									type="text"
									fullWidth
									variant="standard"
									value={action===Actions.In ? new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(localCarTransaction.transaction.dp) : localCarTransaction.transaction.dp}
									onChange={(e: { target: { value: any; }; }) => setLocalCarTransaction({ ...localCarTransaction, transaction:{
										...localCarTransaction.transaction, dp:e.target.value
									} })}
								/>
								<TextField
									disabled={action===Actions.Out}
									margin="dense"
									id="actualPayment"
									name="actualPayment"
									label="Pembayaran Diterima"
									type="text"
									fullWidth
									variant="standard"
									onChange={(e: { target: { value: any; }; }) => setLocalCarTransaction({ ...localCarTransaction, transaction:{
										...localCarTransaction.transaction, actualPayment:e.target.value
									} })}
								/>
						</Stack>
						<Stack>
						<Typography variant="caption" gutterBottom>
							Terhitung dari {format(new Date(localCarTransaction.transaction.out), "EEEE, dd MMMM yyyy, HH:mm", { locale: id })} {'/ '}
							{formatDistanceToNow(localCarTransaction.transaction.out, {locale:id, addSuffix: true})}
						</Typography>
						<Typography variant="body1">
							Tagihan {new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(
								calculateUsageDurationAndCost(localCarTransaction.car, localCarTransaction.transaction).totalCost
								)}
						</Typography>
						</Stack>
					</Stack>
        </DialogContent>
        <DialogActions>
				<Button onClick={onCloseModal}>Batal</Button>
				{/* <Button onClick={()=>handleAction()}>Pembayaran Saja</Button> */}
				<Button onClick={()=>handleAction()}>{`${action.toString()}`}</Button>
        </DialogActions>
    </Dialog>
	);
};

export default CarRentalModal;
