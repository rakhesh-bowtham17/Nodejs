const randomNum = require('random-num')
console.log(randomNum(1,100)) // Random Number from 1 to 100
let http = require('http');
const fs = require("fs");
const { Console } = require('console');
const c = fs.readFileSync("./color_ palette.json");
// console.log(JSON.parse(color));
const color = JSON.parse(c);
let start=0;
let end=color.length;
function getRandomArbitrary(start, end) {
    return randomNum(start,end);
}
let randoncolors = [];
let count =0;
while(count<5){
    let randno = getRandomArbitrary(start, end);
    if(!randoncolors.includes(color[randno])){
        randoncolors.push(color[randno]);
        count++;
    }
}
let result=JSON.stringify(randoncolors);
console.log(result);
fs.writeFileSync("./randon.json", JSON.stringify(randoncolors));
const readreandcolor = JSON.parse(fs.readFileSync("./randon.json"))
console.log(readreandcolor);
http.createServer( (req,res,err) => {
    res.write(result);
    res.end();
}).listen(3750);