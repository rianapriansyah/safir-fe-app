import React, { useEffect, useState } from 'react';
import { Car, TransType, RentType, Transaction } from '../../types/interfaceModels';
import { insert_balance } from '../../services/carBalanceService';
import { addManualTransaction } from '../../services/transactionService';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import {  Grid2 as Grid }  from '@mui/material';
import { getAllCars } from '../../services/carService';
import { DateTimePicker  } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { ManualInputForm } from '../../types/interfaceModels';

interface ManualInputFormProps {
  onSubmit?: (data: ManualInputForm) => void;
}

const ManualInputForm: React.FC<ManualInputFormProps> = ({ onSubmit }) => {
  const [cars, setCars] = useState<Car[]>([]);
  // Define an emptyTransaction object with default values
  const emptyTransaction: Transaction = {
    id: 0,
    vin: '',
    name: '',
    out: new Date(),
    in: new Date(),
    actualPayment: 0,
    desc: '',
    renterName: '',
    renterPhone: '',
    fuelOut: "",
    fuelIn: "",
    rent_type: RentType.Daily.toString(), // or another default value from RentType
    dp: 0,
    completed: true,
    paid: true,
    current_balance: 0,
  };
  
  const [form, setForm] = useState<ManualInputForm>({
      id: 0,
      vin: '',
      amount: 0,
      transaction_type: TransType.deposit,
      description: '',
      reference_id: '',
      name: '',
      created_at: new Date(),
      out : new Date(),
      in : new Date(),
  });

  useEffect(() => {
    fetchCars();
  }, ['pilih mobil']);

  const fetchCars = async () => {
    let isFetching = false;
    if (isFetching) return; // Prevent fetch if already in progress
    isFetching = true;
    const carData = await getAllCars();
    setCars(carData);
    isFetching = false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleDateChange = (name: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: value ? new Date(value) : undefined
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    debugger;

    const updatedForm = {...form, reference_id: form.name};
    // Add to transaction table
    const transactionData: Transaction = {
      ...emptyTransaction,
      vin: form.vin,
      name: form.vin,
      renterName: form.name,
      out: form.out ?? new Date(), // Ensure a valid Date is assigned
      in: form.in ?? new Date(),   // Ensure a valid Date is assigned
      actualPayment: form.amount,
      desc: form.description,
      // Fill other required Transaction fields as needed
    };

    await insert_balance(updatedForm);
    await addManualTransaction(transactionData);
    
    if (onSubmit) onSubmit(form);
    setForm({
      id: 0,
      vin: '',
      amount: 0,
      transaction_type: TransType.deposit,
      description: 'Manual Input',
      reference_id: '',
      name: '',
      created_at: new Date(),
      in: new Date(),
      out: new Date(), 
    });
  };

  return (
    <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }} component="form">
      <Grid container spacing={2}>
        <FormControl fullWidth variant="outlined" >
            <InputLabel id="trans-type-select-label">Jenis Transaksi</InputLabel>
            <Select
              labelId="trans-type-select-label"
              id="transaction_type"
              name="transaction_type"
              value={form.transaction_type}
              onChange={handleChange}
              label="Select Transaction Type"
            >
              <MenuItem value={TransType.deposit}>Pemasukan</MenuItem>
              <MenuItem value={TransType.withdrawal}>Penarikan</MenuItem>
              <MenuItem value={TransType.expense}>Pengeluaran</MenuItem>
            </Select>
          </FormControl>
        <FormControl fullWidth variant="outlined" >
            <InputLabel id="car-select-label">Pilih Mobil</InputLabel>
            <Select
              labelId="car-select-label"
              id="vin"
              name="vin"
              value={form.vin}
              onChange={handleChange}
              label="Select a Car"
            >
              {cars.map((car) => (
                <MenuItem key={car.vin} value={car.vin}>
                  {car.name} - {car.vin}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="name"
            name="name"
            label="Nama Penyewa"
            type="text"
            fullWidth
            value={form.name}
            variant="standard"
            onChange={handleChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker label="Tanggal Keluar" views={['year', 'month', 'day', 'hours']} name='out' onChange={(newValue) => handleDateChange('out', newValue)} />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker label="Tanggal Masuk" views={['year', 'month', 'day', 'hours']} name='in' onChange={(newValue) => handleDateChange('in', newValue)} />
          </LocalizationProvider>
          <TextField
              margin="dense"
              fullWidth
              id="amount"
              name="amount"
              label="Pembayaran Diterima"
              variant="standard"
              type="number"
              value={form.amount}
              onChange={handleChange}
            />
           
            <TextField
            margin="dense"
            fullWidth
            id="description"
            name="description"
            label="Deskripsi"
            type="text"
            value={form.description}
            variant="standard"
            onChange={handleChange}
          />
          <Button onClick={handleSubmit} type="submit" style={{ marginTop: '16px' }} id='add-transaction-button'>Add Transaction</Button>
      </Grid>
    </FormControl>
  );
};

export default ManualInputForm;