export interface UserDocument {
	id: string;
	name: string;
	email: string;
	role: string;
	iat: number;
	exp: number;
}

export interface UsersData {
	id: number;
	avatar: string;
	name: string;
	email: string;
	role: string;
}

export interface Users {
	users: UsersData[];
}
