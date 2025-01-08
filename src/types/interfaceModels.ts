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
	car:Car;
	rentedBy:string;
  out:string;
	in:string;
	rentType:RentType;
}

export enum Actions{
  Out = "Keluar",
  In = "Masuk"
}

export enum RentType{
  ThreeHour = "Tiga Jam",
  Daily = "Harian",
	Monthly = "Bulanan"
}