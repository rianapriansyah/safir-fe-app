export interface Car {
	id: number;
	vin:string;
	owned:boolean;
  name:string;
	dailyRate:number;
	threeHourRate:number;
	monthlyRate:number;
	ready:boolean;
}

export interface Transaction {
	id: number;
	vin:string;
	name:string;
	renterName:string;
	renterPhone:string
  out:Date;
	in:Date;
	rentType:string;
	fuelOut:string;
	fuelIn:string;
	expectedPayment:number;
	actualPayment:number;
	desc:string;
	completed:boolean;
}

export interface CarTransaction {
	car:Car;
	transaction:Transaction;
}

export enum Actions{
  Out = "Keluarkan Mobil",
  In = "Masukkan Mobil"
}

export enum RentType{
  ThreeHour = <any>"Tiga Jam",
  Daily = <any>"Harian",
	Monthly = <any>"Bulanan"
}

export interface RawTransactionData {
  id: number;
  vin: string;
  car_name?: string; // Optional because it may not always be present
  renter_name?: string;
  renter_phone?: string;
  out: string; // ISO string or date string
  in?: string | null; // Optional or null for unfinished transactions
  rent_type: string;
  fuel_out?: string;
  fuel_in?: string;
  expected_payment?: number;
  actual_payment?: number;
  desc?: string;
	completed:boolean;
}