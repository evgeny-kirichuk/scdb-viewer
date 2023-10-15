export type BookData = {
	id: string;
	title: string;
	description: string;
	image?: string;
	pages: number;
	price?: number;
	currency?: string;
	ISBN?: string;
	revision?: string;
};

export type CartItem = BookData & { quantity: number };
