const express = require('express');

const UserService = require('../servises/UserService');

const getBuddies = async (req, res) => {
    const users = await UserService.getUsers();
    res.json(users)
};
const getBuddiesById = async (req, res) => {
    const users = await UserService.getUsersById(req, res);
    res.json(users);
};
const postBuddies = (req, res) => {
    const users = UserService.postUser(req, res);
    res.json(users);
};
const putBuddies = (req, res) => {
    const users = UserService.putUser(req, res);
    res.json(users);
};
const deleteBuddies = (req, res) => {
    const users = UserService.deleteUser(req, res);
    res.json(users);

};
module.exports = {
    getBuddies,
    getBuddiesById,
    postBuddies,
    putBuddies,
    deleteBuddies
}