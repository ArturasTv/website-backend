const mongoose = require("mongoose");
require("dotenv").config();

const { v4: uuidv4 } = require("uuid");

const RefreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: {
    type: Date,
    required: true,
  },
});

RefreshTokenSchema.statics.createToken = async function (user) {
  let expiredAt = new Date();

  expiredAt.setSeconds(
    expiredAt.getSeconds() + +process.env.JWT_REFRESH_EXPIRATION
  );

  let _token = uuidv4();

  let _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });

  console.log(_object);

  let refreshToken = await _object.save();

  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
};

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

module.exports = RefreshToken;
