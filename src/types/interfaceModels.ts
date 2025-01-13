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
  Out = "Keluar",
  In = "Masuk"
}

export enum RentType{
  ThreeHour = <any>"Tiga Jam",
  Daily = <any>"Harian",
	Monthly = <any>"Bulanan"
}