require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const Project = require("../models/project");

const multer = require("multer");

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/" + process.env.FOLDER_FOR_UPLOADS);
  },

  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

const multerUpload = multer({
  storage: storage,
  fileFilter: multerFilter,
}).single("file");

exports.upload = (req, res, err) =>
  multerUpload(req, res, async (err) => {
    console.log(req);

    if (err instanceof multer.MulterError) {
      return res.status(500).send({ message: err });
    } else if (err) {
      console.log(err);
      return res.status(500).send({ message: err });
    }

    const { name, description, gitUrl, projectUrl } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .send({ message: "Please fill in all the required fields" });
    }

    const project = new Project({
      project_name: name,
      project_description: description,
      git_url: gitUrl,
      project_url: projectUrl,
      path_url:
        process.env.BASE_URL +
        process.env.FOLDER_FOR_UPLOADS +
        req.file.filename,
    });

    try {
      const newProject = await project.save();
    } catch (err) {
      return res.status(500).send({ message: "Failed to upload file" });
    }

    return res.status(200).json({
      message: "File uploaded successfully",
    });
  });

exports.getProjects = (req, res) => {
  Project.find({}, async (err, projects) => {
    if (err) {
      res.status(500).send({ message: "Server Error!" });
      return;
    }
    if (!projects) {
      res.status(500).send({ message: "Projects not found!" });
      return;
    }
    return res.status(200).json(projects);
  });
};
