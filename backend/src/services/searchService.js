const { Document } = require('../models');

const searchDocuments = async (query) => {
  return Document.findAll({
    where: {
      title: { $like: `%${query}%` },
    },
  });
};

module.exports = {
  searchDocuments,
};
