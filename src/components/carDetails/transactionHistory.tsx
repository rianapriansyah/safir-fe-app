import { Grid2 as Grid, Paper, Table, TableBody, TableContainer, TableHead, Typography  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Transaction } from '../../types/interfaceModels';
import { StyledTableRow, StyledTableCell } from '../common/table';
import { formatDistance } from 'date-fns';
import { id } from 'date-fns/locale';
import { getAllTransactionsByVin } from '../../services/transactionService';


interface historyProp {
	selectedVin:string;
}

const TransactionHistory: React.FC<historyProp> = ({
	selectedVin
}) => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	useEffect(() => {
		fetchTransactions();
	}, [selectedVin]);

	const fetchTransactions = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const data = await getAllTransactionsByVin(selectedVin);
		setTransactions(data);
		isFetching = false;
	};

return (
	 <Grid>
		<TableContainer component={Paper} sx={{ height: 600 }}>
			<Table stickyHeader>
				<TableHead>
					<StyledTableRow>
						<StyledTableCell>Durasi</StyledTableCell>
						<StyledTableCell>Nama Pemakai</StyledTableCell>
						<StyledTableCell>Pemasukkan</StyledTableCell>
						<StyledTableCell>Keterangan</StyledTableCell>
					</StyledTableRow>
				</TableHead>
				<TableBody>
					{transactions.map((transaction) => (
						<StyledTableRow key={transaction.id}>
							<StyledTableCell>{formatDistance(new Date(transaction.out), new Date(transaction.in), {locale:id})}
							</StyledTableCell>
							<StyledTableCell>{transaction.renterName}
								<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>
									{transaction.renterPhone}
								</Typography>
							</StyledTableCell>
							<StyledTableCell>
								{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(transaction.dp + transaction.actualPayment)}
							</StyledTableCell>
							<StyledTableCell>{transaction.desc}</StyledTableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	</Grid>
	);
};

export default TransactionHistory;
