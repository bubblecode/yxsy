class myDate {
    constructor(value) {
        this.year = Number(value.split(' ')[0].split('-')[0]);
        this.month = Number(value.split(' ')[0].split('-')[1]);
        this.day = Number(value.split(' ')[0].split('-')[2]);
        this.hour = Number(value.split(' ')[1].split(':')[0]);
    }

    earlyThan(myDate) {
        var f;
        if (this.year == myDate.year) {
            if (this.month == myDate.month) {
                if (this.day == myDate.day) {
                    if (this.hour < myDate.hour) {
                        return true;
                    } else return false;
                } else {
                    f = this.day - myDate.day;
                }
            } else {
                f = this.month - myDate.month;
            }
        } else {
            f = this.year - myDate.year;
        }
        return f < 0 ? true : false;
    }
	
	getHours(myDate) {
	}
}

module.exports = myDate;