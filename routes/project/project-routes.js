const express = require("express");

const controller = require("../../controllers/project-controller");
const authJwt = require("../../middlewares/authJwt");

const router = express.Router();

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post("/uploadProject", [authJwt], controller.upload);
router.get("/getProjects", controller.getProjects);

module.exports = router;
