export interface Expense {
	id: number;
	vin:string;
	description:boolean;
  category:string;
	amount:number;
	created_at:Date;
	car_specific:boolean;
}

export interface Car {
	id: number;
	vin:string;
	owned:boolean;
  name:string;
	dailyRate:number;
	threeHourRate:number;
	monthlyRate:number;
	ready:boolean;
	qr_link:string;
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
	dp:number;
	actualPayment:number;
	desc:string;
	completed:boolean;
}

export interface CarTransaction {
	car:Car;
	transaction:Transaction;
}

export interface VCarTransaction {
	car_vin:string;
  name:string;
	dailyRate:number;
	threeHourRate:number;
	monthlyRate:number;
	ready:boolean;
	id: number;
	vin:string;
	car_name:string;
	renter_name:string;
	renter_phone:string
  out:Date;
	in:Date;
	rent_type:string;
	fuel_out:string;
	fuel_in:string;
	dp:number;
	actual_payment:number;
	desc:string;
	completed:boolean;
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
  dp?: number;
  actual_payment?: number;
  desc?: string;
	completed:boolean;
}

export function generate12HourTimes(): { time: string }[] {
	const times: { time: string, id:string }[] = [];
	const now = new Date();
	const currentHour = now.getHours(); // Get the current hour in 24-hour format
	const currentMinutes = now.getMinutes(); // Get the current minutes
	const extraHour = currentMinutes > 15 ? currentHour + 1 : null; // Include the next hour if > 15 minutes

	for (let hour = 8; hour <= 23; hour++) {
		if (hour <= currentHour || hour === extraHour) {
			const formattedHour = (hour > 12 ? hour - 12 : hour).toString().padStart(2, '0'); // Convert 24-hour to 12-hour format
			const suffix = hour >= 12 ? 'PM' : 'AM'; // Add AM/PM
			times.push({ time: `${formattedHour} ${suffix}`, id:`${formattedHour}${suffix}` });
		}
	}
	return times;
}

export function formatSavedTransactionOut(transactionOut: string | Date): string {
	const date = typeof transactionOut === "string" ? new Date(transactionOut) : transactionOut;

	// Extract hours and convert to 12-hour format
	let hour = date.getHours();
	const isPM = hour >= 12;
	hour = hour % 12 || 12; // Convert 0 or 24 to 12

	// Format the time
	const formattedHour = hour.toString().padStart(2, '0');
	const period = isPM ? "PM" : "AM";

	return `${formattedHour} ${period}`;
}