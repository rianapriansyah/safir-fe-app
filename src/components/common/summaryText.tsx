import { Grid2 as Grid, Typography  } from '@mui/material';
import React from 'react';

interface SummaryTextProps {
	owned:boolean;
	total_income:number;
	total_expense:number;
	profit_sharing_amount:number;
}

const SummaryText: React.FC<SummaryTextProps> = ({
	owned,
	total_income,
	total_expense,
	profit_sharing_amount
}) => {

return (
    <React.Fragment>
			<Grid size={6} textAlign={'left'}>
					<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Total Pemasukkan : 
					{new Intl.NumberFormat('id-ID').format(total_income)}</Typography>
					<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Total Pengeluaran : 
					{new Intl.NumberFormat('id-ID').format(total_expense)}</Typography>
					<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Saldo : 
					{new Intl.NumberFormat('id-ID').format(total_income)}
					</Typography>            
					<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Fee Rental : 
					{new Intl.NumberFormat('id-ID').format(profit_sharing_amount)}
					</Typography>
					<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Pemasukkan Bersih (Pemilik) :
					{new Intl.NumberFormat('id-ID').format(owned? (total_income+total_expense) : (total_income+total_expense) - profit_sharing_amount)}
					</Typography>
				</Grid>
		</React.Fragment>
	);
};

export default SummaryText;
