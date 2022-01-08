export interface UserDocument {
	id: string;
	name: string;
	email: string;
	role: string;
	iat: number;
	exp: number;
	avatar: string;
	token?: string;
}

export interface UsersData {
	id: number;
	avatar: File;
	name: string;
	email: string;
	role: string;
}

export interface Users {
	users: UsersData[];
}

export interface TopicsData {
	id: number;
	alias: string;
	title: string;
}

export interface LevelsData {
	id: number;
	alias: string;
	title: string;
}
