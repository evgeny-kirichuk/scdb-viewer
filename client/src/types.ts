export type Connection = {
	status: 'active' | 'loading' | 'idle' | 'unknown';
};

export type ConnectionClient = {
	[key: string]: {
		address: string;
		client_type: string;
		driver_name: string;
	};
};
