const config = require('config.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const mongoose = require('mongoose');
const User = db.User;
const Audit = db.Audit;


module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    logout,
    delete: _delete
};

async function authenticate({ username, password }, ip) {

    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
       var aud=await Audit.create({ user: user._id, clientIp: ip, timestamp: new Date(),type:"Login" });
       console.log(aud);
        return {
            ...userWithoutHash,
            token
        };


    }
}

async function getAll() {
    return await User.find().select('-hash');
}
async function logout(username,ip) {
    const user = await User.findOne({ username });
    const audit= await Audit.create({ user: user._id, clientIp: ip, timestamp: new Date(),type:"Logout" });
    return audit;
}
async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);
    console.log(user);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}