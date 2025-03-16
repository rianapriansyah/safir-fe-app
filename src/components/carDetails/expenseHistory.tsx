import { Grid2 as Grid, Paper, Table, TableBody, TableContainer, TableHead, Typography  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { StyledTableRow, StyledTableCell } from '../common/table';
import { getAllExpensesByVin } from '../../services/expenseService';
import { Expense } from '../../types/interfaceModels';

interface historyProp {
		selectedVin:string;
}

const ExpenseHistory: React.FC<historyProp> = ({
		selectedVin
}) => {
	const [expenses, setExpenses] = useState<Expense[]>([]);

	useEffect(() => {
		fetchExpenses();
	}, [selectedVin]);

	const fetchExpenses = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const expenseData = await getAllExpensesByVin(selectedVin);
		setExpenses(expenseData);
		isFetching = false;
	};

return (
	 <Grid>
		<TableContainer component={Paper} sx={{ height: 600 }}>
			<Table>
				<TableHead>
					<StyledTableRow>
						<StyledTableCell>Tanggal</StyledTableCell>
						<StyledTableCell>Keterangan</StyledTableCell>
						<StyledTableCell>Kategori</StyledTableCell>
						<StyledTableCell>Pengeluaran</StyledTableCell>
						<StyledTableCell>Biaya Oleh</StyledTableCell>
					</StyledTableRow>
				</TableHead>
				<TableBody>
					{expenses.map((expense) => (
						<StyledTableRow key={expense.id}>
							<StyledTableCell>
								{new Intl.DateTimeFormat('id-ID', {dateStyle: 'full',timeZone: 'Asia/Makassar',}).format(new Date(expense.created_at))}
								<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>
								{new Intl.DateTimeFormat('id-ID', {timeStyle: 'long', timeZone: 'Asia/Makassar',}).format(new Date(expense.created_at))}
								</Typography>
							</StyledTableCell>
							<StyledTableCell>{expense.description}</StyledTableCell>
							<StyledTableCell>{expense.category}
							</StyledTableCell>
							<StyledTableCell>
								{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(expense.amount)}
							</StyledTableCell>
							<StyledTableCell>{expense.company_expense? "Rental" : `${expense.vin} - ${expense.name}`  }</StyledTableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	</Grid>
		);
};

export default ExpenseHistory;
