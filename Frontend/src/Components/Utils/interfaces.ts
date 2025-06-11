export interface GetSuggestionsQueryParams {
  address: string;
}

export interface suggestions {
  display_name: string;
  lat: string;
  lon: string;
}

export interface FareParams {
  pickup: string;
  destination: string;
}

export interface FareResponse {
  auto: string;
  car: string;
  motorcycle: string;
}

export interface createRideParams {
  pickup: string;
  destination: string;
  vehicleType: String;
}

export interface createRideResponse {
  user: string;
  captain?: string;
  pickup: string;
  destination: string;
  otp?: string;
  status: string;
}

interface User {
  fullname: {
    firstname: string;
    lastname: string;
  };
  email: string;
  _id: string | number;
  socketID?: string | number;
  vehicle?: {
    plate: string;
  };
}
export interface rideResponse {
  pickup: string;
  destination: string;
  _id: number | string;
  fare: string | number;
  status: string;
  otp?: string;
  user: User;
}

export interface UserRideResponse extends rideResponse {
  captain: User;
}
