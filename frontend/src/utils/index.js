const getFormattedNameDNI = (apellidoPaterno, apellidoMaterno, nombres) => {
    const maternalInitial = apellidoMaterno ? apellidoMaterno.trim().slice(0, 1).toUpperCase() : ''
    const names = (nombres || '').trim().split(/\s+/).filter(Boolean)
    let namePart = ''
    if (names.length >= 2) {
        const first = names[0]
        const secondInitial = names[1].slice(0, 1).toUpperCase()
        namePart = `${first} ${secondInitial}.`
    } else if (names.length === 1) {
        namePart = `${names[0].slice(0, 1).toUpperCase()}.`
    }
    const sep = maternalInitial ? `${maternalInitial}, ` : ''
    return `${apellidoPaterno} ${sep}${namePart}`
}
const formatDate = (date) => {
	if (!date) return "";

	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
};

export {
    getFormattedNameDNI,
    formatDate
}