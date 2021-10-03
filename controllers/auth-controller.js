require("dotenv").config();
const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signIn = (req, res) => {
  User.findOne({
    name: req.body.username,
  }).exec(async (err, user) => {
    if (err) {
      res.status(500).send({ message: "Server Error!" });
      return;
    }

    if (!user) {
      res.status(500).send({ message: "Wrong Username or Password!" }); //User not found
      return;
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(403).send({
        accessToken: null,
        message: "Wrong Username or Password!", // Invalid Password
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRES_IN,
    });
    const refreshToken = await RefreshToken.createToken(user);

    res.status(200).send({
      id: user._id,
      name: user.name,
      accessToken: token,
      refreshToken: refreshToken,
    });
  });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    res.status(403).json({
      message: "Refresh Token is required!",
    });
    return;
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      });
      res.status(403).json({
        message: "Refresh token was expired!. Please make a new sign request",
      });
      return;
    }
    const newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: +process.env.JWT_EXPIRES_IN,
      }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error!" });
  }
};
