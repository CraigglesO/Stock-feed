var dayOfWeek = require('day-of-week').get
var monthDays = require('month-days');
var nextDay = require("nextday-js");

let totalMonthDays = monthDays(9, 2016);

day = new Date(2016, 9, 1);
day2 = new Date().getMonth();

console.log(day2);
//day = (day + 5) % 7;
console.log(day.getDay());
console.log(totalMonthDays);
