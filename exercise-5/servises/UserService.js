const express = require('express');
const fs = require('fs');
const winston = require('winston');
const helpfunction = require('../utils/util')
const app = express();
app.use(express.json());

const filePath = './cdw_ace23_buddies.json';

const logger = winston.createLogger({
    level: process.env.LOGGER_LEVEL || 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({ format: winston.format.simple() })
    ]
});

const getUsers = () => {
    try {
        const buddies = helpfunction.readFile(filePath);
        logger.info('GET /buddies - success');
        return buddies;
    } catch (error) {
        logger.error(`GET /buddies - ${error.message}`);
        return helpfunction.errormessage("internalservererror");
    }
}
const getUsersById = (req, res) => {
    try {
        const buddies = helpfunction.readFile(filePath);
        const buddy = buddies.find(b => b.employeeId === req.params.id || b.realName === req.params.id);
        if (buddy) {
            logger.info(`GET /buddy/${req.params.id} - success`);
            return buddy;
        } else {
            logger.warn(`GET /buddy/${req.params.id} - not found`);
            return helpfunction.errormessage("buddynotfound");
        }
    } catch (error) {
        logger.error(`GET /buddy/${req.params.id} - ${error.message}`);
        return helpfunction.errormessage("internalservererror");
    }
}
const postUser = (req, res) => {
    try {
        const buddies = helpfunction.readFile(filePath);
        const buddy = buddies.find(b => b.employeeId === req.params.id || b.realName === req.params.id);
        if(buddy){
            return helpfunction.errormessage("useralreadythere");
        }
        else{
            if(req.params.id === req.body.employeeId || req.params.id === req.body.realName){
            }
            else{
                return helpfunction.errormessage("entercorrectdetails");
            }
        }
        const newBuddy = req.body;
        buddies.push(newBuddy);
        helpfunction.writeFile(filePath,buddies);
        res.send({ message: 'Buddy added successfully' });
        logger.info('POST /buddy - success');
    } catch (error) {
        logger.error(`POST /buddy - ${error.message}`);
        return helpfunction.errormessage("internalservererror");
    }
}
const putUser = (req, res) => {
    try {
        const buddies = helpfunction.readFile(filePath);
        const index = buddies.findIndex(b => b.employeeId === req.params.id || b.realName === req.params.id);
        if (index !== -1) {
            buddies[index] = { ...buddies[index], ...req.body };
            helpfunction.writeFile(filePath,buddies);
            res.send({ message: 'Buddy updated successfully' });
            logger.info(`PUT /buddy/${req.params.id} - success`);
        } else {
            logger.warn(`PUT /buddy/${req.params.id} - not found`);
            return helpfunction.errormessage("buddynotfound");

        }
    }
    catch (error) {
        logger.error(`PUT /buddy/${req.params.id} - ${error.message}`);
        return helpfunction.errormessage("internalservererror");
    }
}
const deleteUser = (req, res) => {
    try {
        const buddies = helpfunction.readFile(filePath);
        const index = buddies.findIndex(b => b.employeeId === req.params.id || b.realName === req.params.id);
        if (index !== -1) {
            buddies.splice(index, 1);
            helpfunction.writeFile(filePath,buddies);
            res.send({ message: 'Buddy deleted successfully' });
            logger.info(`DELETE /buddy/${req.params.id} - success`);
        } else {
            logger.warn(`DELETE /buddy/${req.params.id} - not found`);
            return helpfunction.errormessage("buddynotfound");
        }
    } catch (error) {
        logger.error(`DELETE /buddy/${req.params.id} - ${error.message}`);
        return helpfunction.errormessage("internalservererror");
    }
}
module.exports = {
    getUsers,
    getUsersById,
    postUser,
    putUser,
    deleteUser
}