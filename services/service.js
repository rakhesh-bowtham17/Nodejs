const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const helperfunction = require('../utils/util');
const dbFilePath = './database.json';

const secretKey = 'mySecretKey';

const servicecreateUserRead = (req, res, username) => {
    if (req.params.id == "create") {
        if (!fs.existsSync(`${username}.json`)) {
            fs.writeFileSync(`${username}.json`, '[]');
        }
        const userData = helperfunction.readUserData(username);
        const { title, description, priority, dueDate, comments } = req.body;
        const timestamp = Date.now();
        const id = userData.length + 1;
        const task = { id, title, description, priority, dueDate, comments, timestamp };
        userData.push(task);
        helperfunction.writeUserData(username, userData);
        res.status(201).send({ message: 'Task created successfully' });
    }
    if (req.params.id == "read") {
        if (!fs.existsSync(`${username}.json`)) {
            res.send("no task available create a task");
        }
        const userData = helperfunction.readUserData(username);
        if (userData.length == 0) {
            res.send("no task available")
        }
        const result = helperfunction.pagination(req,res,userData);
        res.send(result);
        res.status(202).send({ message: 'Task read successfully' });
    }
}
const servicegetUserById = (req, res, username) => {
    if (!fs.existsSync(`${username}.json`)) {
        res.send("no task available create a task");
    }
    const userData = helperfunction.readUserData(username);
    if (userData.length == 0) {
        res.send("no task available")
    }
    const index = userData.findIndex(u => u.id == req.params.id);
    if (index !== -1) {
        res.json(userData[index]);
    } else {
        res.status(404).send('user not found');
    }
    res.status(202).send({ message: 'Task read successfully' });
}
const serviceupdateUser = (req, res, username) => {
    if (!fs.existsSync(`${username}.json`)) {
        res.send("no task available create a task");
    }
    const userData = helperfunction.readUserData(username);
    if (userData.length == 0) {
        res.send("no task available")
    }
    const index = userData.findIndex(u => u.id == req.params.id);
    if (index !== -1) {
        userData[index] = { ...userData[index], ...req.body };
        helperfunction.writeUserData(username, userData);
        res.send('userupdated');
    } else {
        res.status(404).send('user not found');
    }
    res.status(202).send({ message: 'Task updated successfully' });
}
const servicedeleteUser = (req, res, username) => {
    if (!fs.existsSync(`${username}.json`)) {
        res.send("no task available create a task");
    }
    const userData = helperfunction.readUserData(username);
    if (userData.length == 0) {
        res.send("no task available")
    }
    const index = userData.findIndex(u => u.id == req.params.id);
    if (index !== -1) {
        userData.splice(index, 1);
        helperfunction.writeUserData(username, userData);
        res.send('userupdated');
    } else {
        res.status(404).send('user not found');
    }
    res.status(202).send({ message: 'Task deleted successfully' });
}
const serviceFilterUser = (req, res, username) => {
    if (!fs.existsSync(`${username}.json`)) {
        res.send("no task available create a task");
    }
    console.log("'line 92")
    const userData = helperfunction.readUserData(username);
    if (userData.length == 0) {
        res.send("no task available")
    }
    console.log("'line 9")
    console.log(req.params.id1, req.params.id2);
    const filterdata = userData.filter(object => {
        const key = req.params.id1;
        const value = req.params.id2;
        return object[key] == value;
    })
    if (filterdata.length == 0) {
        return res.status(404).json({ message: 'no filtered task avalable' })
    }
    const result = helperfunction.pagination(req,res,filterdata);
    res.send(result);
}
const servicesortUser = (req, res, username) => {
    if (!fs.existsSync(`${username}.json`)) {
        res.send("no task available create a task");
    }
    const userData = helperfunction.readUserData(username);
    if (userData.length == 0) {
        res.send("no task available")
    }
    const key = req.params.id;
    function sortdata(data, key) {
        return data.sort((a, b) => (a[key] > b[key] ? 1 : -1));
    }
    const sorteddata = sortdata(userData, key);
    if (sorteddata.length == 0) {
        return res.status(404).json({ message: 'no filtered task avalable' })
    }
    const result = helperfunction.pagination(req,res,sorteddata);
    res.send(result);
}
const serviceregisterUser = (async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const usersData = JSON.parse(fs.readFileSync(dbFilePath));

    usersData.push({ username, hashedPassword });

    fs.writeFileSync(dbFilePath, JSON.stringify(usersData));
    res.json({ message: 'User created successfully' });

});
const serviceloginUser = (async (req, res) => {
    const { username, password } = req.body;
    console.log(144)
    const usersData = JSON.parse(fs.readFileSync(dbFilePath));
    console.log(144)
    const user = usersData.find(u => u.username === username);
    console.log(user === undefined);
    if (user === undefined) {
        // res.status(401).json({ message: 'Invalid username or password' });
        return { "status": 401, "message": "Invalid username or password", "data": "" }
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) {
        // res.status(401).json({ message: 'Invalid username or password' });
        return { "status": 401, "message": "Password Mismatch", "data": "" }
    }

    const token = jwt.sign({ username }, secretKey, { expiresIn: '30m' });
    if (!fs.existsSync(`${username}.json`)) {
        fs.writeFileSync(`${username}.json`, '[]');
    }

    if (token) {
        return { "status": 200, "message": "", "data": { "token": token, "data": helperfunction.readUserData(username) } }
    } else {
        return { "status": 401, "message": "Invalid Token", "data": "" }
    }
});
module.exports = {
    servicecreateUserRead,
    servicegetUserById,
    serviceupdateUser,
    servicedeleteUser,
    serviceregisterUser,
    serviceloginUser,
    serviceFilterUser,
    servicesortUser
}