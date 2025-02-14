import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Car, Expense, ExpenseCategory } from '../../types/interfaceModels';
import { get_expense_categories } from '../../services/expenseService';


interface ExpenseModalProps {
	expense:Expense;
	cars:Car[];
	isModalOpen: boolean;
	onCloseModal: () => void;
	onSaveExpense: (expense: Expense) => void; // Callback for saving the expense
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
	expense,
	cars,
	isModalOpen,
	onCloseModal,
	onSaveExpense
}) => {

  const [localExpense, setLocalExpense] = useState<Expense>(expense); // Local state for the note
	const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory[]>([]);
	// const [companyExpense, setCompanyExpense] = useState(false);

	useEffect(() => {
		setLocalExpense(expense); // Update localExpense when the modal opens
	}, []);

	useEffect(() => {
		fetchExpenseCategory(); // Update localExpense when the modal opens
	}, []);

	const fetchExpenseCategory = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const data = await get_expense_categories();
		setExpenseCategory(data);
		isFetching = false;
	};

	const handleCarChange = async (e: SelectChangeEvent<string>) => {
		setLocalExpense({...localExpense, vin:e.target.value as string});
	};

	const handleCatChange = async (e: SelectChangeEvent<string>) => {
		setLocalExpense({...localExpense, category_id:Number(e.target.value)});
	};



return (
    <Dialog open={isModalOpen} onClose={onCloseModal} fullWidth={true}>
        <DialogTitle>Catat Pengeluaran</DialogTitle>
        <DialogContent>
					<Stack spacing={2}>
					<FormControl fullWidth variant="standard">
							<InputLabel id="car-select-label" autoFocus>Kategori</InputLabel>
								<Select
									required
									labelId="car-select-label"
									id="car-select-label"
									value={String(localExpense.category_id)}
									onChange={handleCatChange}
									>
										{expenseCategory.map((cat)=>
										<MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
									)}		
								</Select>
							</FormControl>
						<TextField
							autoFocus
							required
							margin="dense"
							id="description"
							name="description"
							label="Deskripsi"
							type="text"
							fullWidth
							variant="standard"
							value={localExpense.description}
							onChange={(e: { target: { value: any; }; }) => setLocalExpense({ ...localExpense, description: e.target.value })}
						/>
						<TextField
							autoFocus
							required
							margin="dense"
							id="price"
							name="amount"
							label="Nominal"
							type="text"
							fullWidth
							variant="standard"
							value={localExpense.amount}
							onChange={(e: { target: { value: any; }; }) => setLocalExpense({ ...localExpense, amount: e.target.value })}
						/>
						
						<FormControl fullWidth variant="standard">
							<InputLabel id="car-select-label" autoFocus>Mobil</InputLabel>
								<Select
									disabled={localExpense.company_expense}
									required
									labelId="car-select-label"
									id="car-select-label"
									value={localExpense.vin}
									onChange={handleCarChange}
									>
										{cars.map((car)=>
										<MenuItem key={car.vin} value={car.vin}>{car.name} - {car.vin}</MenuItem>
									)}		
								</Select>
							</FormControl>
					</Stack>
        </DialogContent>
        <DialogActions>
				<Button onClick={onCloseModal}>Batal</Button>
				<Button onClick={()=>onSaveExpense(localExpense)}>Catat Pengeluaran</Button>
        </DialogActions>
    </Dialog>
	);
};

export default ExpenseModal;