const Repository = require("../models/repository");

exports.getRepositories = (req, res) => {
  Repository.find({}, async (err, repositories) => {
    if (err) {
      res.status(500).send({ message: "Server Error!" });
      return;
    }
    if (!repositories) {
      res.status(500).send({ message: "Repositories not found!" });
      return;
    }
    return res.status(200).json(repositories);
  });
};
