const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const app = express();
app.use(bodyParser.json());
const service = require('../services/service');

const dbFilePath = './database.json';

if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, '[]');
}
const secretKey = 'mySecretKey';

const createUserRead = (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Missing authorization header' });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, secretKey);
        const { username } = decodedToken;
        console.log(username);
        const usersData = JSON.parse(fs.readFileSync(dbFilePath));
        
        const user = usersData.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        service.servicecreateUserRead(req, res, username);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const getUserById = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Missing authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
        
        const decodedToken = jwt.verify(token, secretKey);
        const { username } = decodedToken;
        
        const usersData = JSON.parse(fs.readFileSync(dbFilePath));
       
        const user = usersData.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        service.servicegetUserById(req, res, username);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

const updateUser = (req,res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Missing authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
        
        const decodedToken = jwt.verify(token, secretKey);
        const { username } = decodedToken;
        
        const usersData = JSON.parse(fs.readFileSync(dbFilePath));
        
        const user = usersData.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        service.serviceupdateUser(req, res, username);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}
const deleteUser = (req,res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Missing authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
       
        const decodedToken = jwt.verify(token, secretKey);
        const { username } = decodedToken;
        
        const usersData = JSON.parse(fs.readFileSync(dbFilePath));
        
        const user = usersData.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        service.servicedeleteUser(req, res, username);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}
const filteruser = (req,res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Missing authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
       
        const decodedToken = jwt.verify(token, secretKey);
        const { username } = decodedToken;
        
        const usersData = JSON.parse(fs.readFileSync(dbFilePath));
        
        const user = usersData.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const filteredresult = service.serviceFilterUser(req, res, username);
        res.json(filteredresult);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}
const sortuser = (req,res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Missing authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
       
        const decodedToken = jwt.verify(token, secretKey);
        const { username } = decodedToken;
        
        const usersData = JSON.parse(fs.readFileSync(dbFilePath));
        
        const user = usersData.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const sortresult = service.servicesortUser(req, res, username);
        res.json(sortresult);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

const registerUser = ( async (req, res) => {
    try{
        await service.serviceregisterUser(req, res);
    }catch(err){
        res.status(401).json({ message: 'Invalid token' });
    }
});


const loginUser = ( async (req, res) => {
    try{
        let resp = await service.serviceloginUser(req, res);
        res.json({"status": 401,"message": resp.message, "data": resp.data});
    }catch(err){
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = {
    createUserRead,
    getUserById,
    updateUser,
    deleteUser,
    registerUser,
    loginUser,
    filteruser,
    sortuser
}