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

export type ClusterPeer = {
	data_center: string;
	host_id: string;
	peer: string;
	preferred_ip: string;
	rack: string;
	release_version: string;
	rpc_address: string;
	schema_version: string;
};

export type LocalPeer = {
	bootstrapped: string;
	broadcast_address: string;
	cluster_name: string;
	cql_version: string;
	data_center: string;
	gossip_generation: number;
	host_id: string;
	key: string;
	listen_address: string;
	native_protocol_version: string;
	partitioner: string;
	rack: string;
	release_version: string;
	rpc_address: string;
	schema_version: string;
};