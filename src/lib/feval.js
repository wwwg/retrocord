module.exports = str => {
	let res, success = true;
	try {
		res = eval(str);
	} catch (e) {
		success = false;
		res = (e.toString());
	}
	return res;
}