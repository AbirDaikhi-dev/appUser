

export interface User {
    id: any;
    name: string;
    username: string;
    email: string;
    password?: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
    role: string;
  }

export interface Geo {
    lat: string;
    lng: string;
  }
  
  export interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
  }
  
  export interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
  }
  

  