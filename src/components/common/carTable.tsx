import { TableRow, TableCell, IconButton, Collapse, Box, Table, TableBody, TableHead, Typography } from "@mui/material";
import React from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function Row(props: { row: any }) {
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
					{row.title}
				</TableCell>
				<TableCell align="right">
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Table size="small" aria-label="purchases">
							<TableHead>
								<TableRow>
									<TableCell>Mobil</TableCell>
									{/* <TableCell>Jumlah Hari Keluar</TableCell> */}
									<TableCell align="right">Saldo Rekening</TableCell>
									<TableCell align="right">Fee Rental</TableCell>
									<TableCell align="right">Pengeluaran</TableCell>
									<TableCell align="right">Pemasukan Bersih</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
                  {row.cars.map((car : any) => (
                    <TableRow key={car.vin}>
                      <TableCell component="th" scope="row">{car.name} - {car.vin}</TableCell>
                      <TableCell align="right">{new Intl.NumberFormat('id-ID').format(car.total_income)}</TableCell>
											<TableCell align="right">{new Intl.NumberFormat('id-ID').format(car.profit_sharing_amount)}

											<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>
												{new Intl.NumberFormat('id-ID').format(car.profit_sharing)}% dari Total Pemasukan
											</Typography>
											</TableCell>
                      <TableCell align="right">{new Intl.NumberFormat('id-ID').format(car.total_expense)}</TableCell>
                      <TableCell align="right">{new Intl.NumberFormat('id-ID').format(car.owned? car.total_nett_income : car.total_nett_income - car.profit_sharing_amount)}
											{car.owned? "": 
											<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>
												Pemilik Mobil
											</Typography>}
											</TableCell>
										</TableRow>
                  ))}
									<TableRow key="99">
										<TableCell component="th" scope="row">Total</TableCell>
										<TableCell align="right">
											{new Intl.NumberFormat('id-ID').format(row.cars.reduce((sum: number, car: { total_income: number; }) => sum + car.total_income, 0))}
										</TableCell>
										<TableCell align="right">
											{new Intl.NumberFormat('id-ID').format(row.cars.reduce((sum: number, car: { profit_sharing_amount: number; }) => sum + car.profit_sharing_amount, 0))}
										</TableCell>
										<TableCell align="right">
											{new Intl.NumberFormat('id-ID').format(row.cars.reduce((sum: number, car: { total_expense: number; }) => sum + car.total_expense, 0))}
										</TableCell>
										<TableCell align="right">
										{row.id=="2"? "": 
											new Intl.NumberFormat('id-ID').format(row.cars.reduce((sum: number, car: { total_nett_income: number; }) => sum + car.total_nett_income, 0))}
											
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