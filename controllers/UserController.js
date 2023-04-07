const express = require('express');
const loggerfunction = require('../logger.js')
const UserService = require('../servises/UserService');
const logger = loggerfunction.log();
const getBuddies = async (req, res) => {
    try{
        const users = await UserService.getUsers();
        res.json(users)
        logger.info('GET /buddies in controllers - success');
    }catch(err){
        logger.warn(`GET /buddies - ${error.message} in controllers`);
    }
};
const getBuddiesById = async (req, res) => {
    try{
        const users = await UserService.getUsersById(req, res);
        res.json(users);
        logger.info(`GET /buddies ${req.params.id} in controllers - success`);
    }
    catch(err){
        logger.warn(`GET /buddy/${req.params.id} - ${err.message} in controllers`);
    }
};
const postBuddies = (req, res) => {
    try{
        const users = UserService.postUser(req, res);
        res.json(users);
        logger.info('POST /buddy - success in controllers');
    }
    catch(err){
        logger.error(`POST /buddy - ${error.message} in controllers`);
    }
};
const putBuddies = (req, res) => {
    try{
        const users = UserService.putUser(req, res);
        res.json(users); 
        logger.info(`PUT /buddy/${req.params.id} - success in controllers`);
    }
    catch(err){
        logger.error(`PUT /buddy/${req.params.id} - ${error.message} in controllers`);
    }
};
const deleteBuddies = (req, res) => {
    try{
        const users = UserService.deleteUser(req, res);
        res.json(users);
        logger.info(`DELETE /buddy/${req.params.id} - success in controllers`);
    }
    catch(err){
        logger.error(`DELETE /buddy/${req.params.id} - ${error.message} in controllers`);
    }

};
module.exports = {
    getBuddies,
    getBuddiesById,
    postBuddies,
    putBuddies,
    deleteBuddies
}