import React, {
	ReactElement,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

import { Connection, ConnectionClient } from '~/types';

interface ConnectionContext {
	connection: Connection;
	client: ConnectionClient;
}

export const ConnectionContext = createContext<ConnectionContext>({
	connection: {
		status: 'unknown',
	},
	client: {
		id: {
			address: '',
			client_type: '',
			driver_name: '',
		},
	},
});

export const ConnectionProvider: React.FC<{ children: ReactElement }> = ({
	children,
}) => {
	const [connectionState, setConnectionState] = useState<Connection>({
		status: 'unknown',
	});
	const [clientState, setClientState] = useState<ConnectionClient>({
		id: {
			address: '',
			client_type: '',
			driver_name: '',
		},
	});

	const ping = async () => {
		try {
			const res = await fetch(`http://localhost:8000/api/v1/status`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});

			if (!res.ok) {
				return;
			}

			try {
				const data: Connection = await res.json();
				setConnectionState(data);
			} catch (err) {
				console.log(err);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const connect = async () => {
		try {
			const res = await fetch(`http://localhost:8000/api/v1/connect`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});

			if (!res.ok) {
				return;
			}

			try {
				const data: Connection = await res.json();
				setConnectionState(data);
				if (data.status === 'loading') {
					setTimeout(() => {
						connect();
					}, 2000);
				}
			} catch (err) {
				console.log(err);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const loadClients = async () => {
		try {
			const cl = await fetch(`http://localhost:8000/api/v1/clients`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});

			if (!cl.ok) {
				return;
			}

			try {
				const data: ConnectionClient = await cl.json();
				setClientState(data);
			} catch (err) {
				console.log('ERROR', err);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		ping();
	}, []);

	useEffect(() => {
		if (connectionState.status === 'idle') {
			connect();
		}

		if (connectionState.status === 'active') {
			loadClients();
		}
	}, [connectionState]);

	const value = {
		connection: connectionState,
		client: clientState,
	};

	return (
		<ConnectionContext.Provider value={value}>
			{children}
		</ConnectionContext.Provider>
	);
};

export const useConnection = () => {
	return useContext(ConnectionContext);
};
