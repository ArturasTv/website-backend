const express = require("express");

const controller = require("../../controllers/repositories-controller");

const router = express.Router();

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/getrepositories", controller.getRepositories);

module.exports = router;
