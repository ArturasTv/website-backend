const axios = require("axios");
const Repository = require("../models/repository");
require("dotenv").config();

const getRepositories = async () => {
  try {
    const response = await axios.get(process.env.GITHUB_URL);
    return await response.data;
  } catch (error) {
    console.error(error);
  }
};

const updateDatabase = async () => {
  Repository.collection.drop();
  const data = await getRepositories();
  const filteredData = data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      html_url: item.html_url,
      description: item.description,
      language: item.language,
      created_at: item.created_at,
    };
  });

  const n = filteredData.length;

  for (let i = 0; i < n; i++) {
    const repository = new Repository({
      id: filteredData[i].id,
      name: filteredData[i].name,
      html_url: filteredData[i].html_url,
      description: filteredData[i].description,
      language: filteredData[i].language,
      created_at: filteredData[i].created_at.split("T")[0],
    });

    try {
      const newRepository = await repository.save();
    } catch (err) {
      console.error(err);
    }
  }
};

module.exports = updateDatabase;
