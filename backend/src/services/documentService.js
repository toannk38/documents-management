const { Document } = require('../models');

const createDocument = async (data) => Document.create(data);
const getDocumentById = async (id) => Document.findByPk(id);
const updateDocument = async (id, data) => Document.update(data, { where: { id } });
const deleteDocument = async (id) => Document.destroy({ where: { id } });

module.exports = {
  createDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
};
