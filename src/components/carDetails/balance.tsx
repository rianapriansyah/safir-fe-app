import { Grid2 as Grid, Paper, Table, TableBody, TableContainer, TableHead  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CarBalance } from '../../types/interfaceModels';
import { StyledTableRow, StyledTableCell } from '../common/table';
import { get_balance_by_vin } from '../../services/carBalanceService';


interface balanceProp {
	selectedVin:string;
}

const Balance: React.FC<balanceProp> = ({
	selectedVin
}) => {
	const [balances, setBalances] = useState<CarBalance[]>([]);

	useEffect(() => {
		fetchBalances();
	}, [selectedVin]);

	const fetchBalances = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const balanceData = await get_balance_by_vin(selectedVin);
		setBalances(balanceData);
		isFetching = false;
	};

return (
   <Grid>
		 <TableContainer component={Paper} sx={{ height: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <StyledTableRow>
				<StyledTableCell>Tanggal</StyledTableCell>
				<StyledTableCell>Jenis</StyledTableCell>
				<StyledTableCell>Keterangan</StyledTableCell>
              <StyledTableCell>Nominal</StyledTableCell>
              <StyledTableCell>Referensi</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {balances.map((balance) => (
              <StyledTableRow key={balance.id}>
								<StyledTableCell>{new Intl.DateTimeFormat('id-ID', {dateStyle: 'full',timeZone: 'Asia/Makassar',}).format(new Date(balance.created_at))}</StyledTableCell>
								<StyledTableCell>{balance.transaction_type}</StyledTableCell>
								<StyledTableCell>{balance.description}</StyledTableCell>
                <StyledTableCell>{new Intl.NumberFormat('id-ID', {style:'decimal'}).format(balance.amount)}
								</StyledTableCell>
                <StyledTableCell>{balance.reference_id}
								</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
	 </Grid>
	);
};

export default Balance;
