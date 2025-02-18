const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    last_login: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
