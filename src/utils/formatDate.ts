export const formatDate = (date: string) => {
	const dat = new Date(date);
	return `${dat.getDate()}.${dat.getMonth() + 1}.${dat.getFullYear()}`;
};
