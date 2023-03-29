const fs = require("fs");
const colorPalette = fs.readFileSync("./color_ palette.json");
const color = JSON.parse(colorPalette);
let start=0;
let end=color.length;
function getRandomArbitrary(start, end) {
    return Math.floor(Math.random() * (start - end + 1) + end);
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
fs.writeFileSync("./randon.json", JSON.stringify(randoncolors));
const readrandomcolor = JSON.parse(fs.readFileSync("./randon.json"))
console.log(readrandomcolor);