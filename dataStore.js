class DataStore {
	constructor(data) {
		this.data = data;
	}
	get(pos, max, key) {
		pos = pos ? pos-0 : 0;
		max = (max && 200 <= max) ? max-0 : 50;
		let ret = {};
		let cnt = 0;
		const regk = new RegExp(key, "i");
		for (let v in this.data) {
			if (cnt >= max) break;
			if ((pos < (v-0))
				&& (key == "" || (
					regk.test(this.data[v].name) ||
					regk.test(this.data[v].sex) ||
					regk.test(this.data[v].birthday) ||
					regk.test(this.data[v].address)
				))) {
				ret[v] = this.data[v];
				cnt++;
			}
		}
		return ret;
	}
}

module.exports = DataStore;