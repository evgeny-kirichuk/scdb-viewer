import React from 'react';

import { ClusterPeer, LocalPeer } from '~/types';

interface DcInfoProps {
	title: string;
	peers: (ClusterPeer | LocalPeer)[];
}

export const DcInfo: React.FC<DcInfoProps> = ({ title, peers }) => {
	return (
		<div>
			<span>{title}</span>
			{peers.map((peer) => (
				<span key={peer.host_id}>{peer.rack}</span>
			))}
		</div>
	);
};
