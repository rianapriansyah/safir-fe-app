import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Actions, Car } from "../types/interfaceModels";


interface carModalProps {
	car:Car;
	isModalOpen: boolean;
	action: Actions;
	onCloseModal: () => void;
	// onSavecar: (car: car) => void; // Callback for saving the car
	// onDeletecar: (car: car) => void; // Callback for saving the car
}

const CarRentalModal: React.FC<carModalProps> = ({
	car,
	isModalOpen,
	action,
	onCloseModal,
	// onSavecar,
	// onDeletecar
}) => {

  const [localCar, setLocalCar] = useState<Car>(car); // Local state for the note

	useEffect(() => {
		setLocalCar(car); // Update localCar when the modal opens
	}, [car]);

	const handleAction = async () => {
		setLocalCar(localCar);

		// if(action==Actions.Delete){
		// 	onDeletecar(localCar); // Call the save function passed from the parent
		// }else{
		// 	onSavecar(localCar); // Call the save function passed from the parent
		// }		
	};

return (
    <Dialog open={isModalOpen} onClose={onCloseModal} fullWidth={true}>
        <DialogTitle>{localCar.vin}</DialogTitle>
        <DialogContent>
				<Stack spacing={2}>
				<Stack spacing={2} direction="row">
						<TextField
							autoFocus
							required
							margin="dense"
							id="carName"
							name="carName"
							label="Nama Kategori"
							type="text"
							fullWidth
							variant="standard"
							value={localCar.name}
							onChange={(e: { target: { value: any; }; }) => setLocalCar({ ...localCar, name: e.target.value })}
						/>
						<TextField
							autoFocus
							required
							margin="dense"
							id="price"
							name="carDescription"
							label="Deskripsi"
							type="text"
							fullWidth
							variant="standard"
							// onChange={(e: { target: { value: any; }; }) => setLocalCar({ ...localCar, description: e.target.value })}
						/>
					</Stack>
				</Stack>
        </DialogContent>
        <DialogActions>
				<Button onClick={onCloseModal}>Batal</Button>
				<Button onClick={()=>handleAction()}>{`Mobil ${action.toString()}`}</Button>
        </DialogActions>
    </Dialog>
	);
};

export default CarRentalModal;
