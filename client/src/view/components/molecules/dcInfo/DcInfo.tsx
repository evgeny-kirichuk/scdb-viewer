import React from 'react';

import { ClusterPeer, LocalPeer } from '~/types';

import styles from './DcInfo.module.scss';

interface DcInfoProps {
	title: string;
	peers: (ClusterPeer | LocalPeer)[];
}

export const DcInfo: React.FC<DcInfoProps> = ({ title, peers }) => {
	return (
		<div className={styles.root}>
			<span>{title}</span>
			{peers.map((peer) => (
				<span key={peer.host_id}>
					{peer.broadcast_address || peer.preferred_ip}
				</span>
			))}
		</div>
	);
};
