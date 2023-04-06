const fs = require('fs');
function readFile(file){
    try{
        return JSON.parse(fs.readFileSync(file));
    }
    catch(err){
        return "Error in reading file"
    }
}
function writeFile(file, buddy){
    try{
        return fs.writeFileSync(file, JSON.stringify(buddy));
    }
    catch(err){
        return "Error in writing file"
    }
}
function errormessage(type){
    if(type=="internalservererror"){
        return {
            status: 404,
            message: "Internal Server Error"
        }
    }
    else if(type == "buddynotfound"){
        return{
            status: 404,
            message: "Buddy not found"
        }
    }
    else if(type == "useralreadythere"){
        return{
            status: 404,
            message: "Buddy already exits"
        }
    }
    else if(type == "entercorrectdetails"){
        return{
            status: 404,
            message: "enter correct parrameters"
        }
    }
}
module.exports = {
    readFile,
    writeFile,
    errormessage
}