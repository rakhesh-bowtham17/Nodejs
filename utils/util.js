const fs = require('fs');

const readUserData = (username) => {
    const data = JSON.parse(fs.readFileSync(`${username}.json`, 'utf8'));
    return data;
}

const writeUserData = (username, data) => {
    fs.writeFileSync(`${username}.json`, JSON.stringify(data));
}
const pagination = (req, res, userData) => {

    const itemsPerPage = 10;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedData = userData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(userData.length / itemsPerPage);
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    return res.json({
        usertask: slicedData,
        currentPage: currentPage,
        totalPages: totalPages
    });
}
module.exports = {
    readUserData,
    writeUserData,
    pagination
}