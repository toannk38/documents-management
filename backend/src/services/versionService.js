const { DocumentVersion } = require('../models');

const createVersion = async (data) => DocumentVersion.create(data);
const getVersionsByDocument = async (documentId) => DocumentVersion.findAll({ where: { document_id: documentId } });
const updateVersion = async (id, data) => DocumentVersion.update(data, { where: { id } });
const deleteVersion = async (id) => DocumentVersion.destroy({ where: { id } });

module.exports = {
  createVersion,
  getVersionsByDocument,
  updateVersion,
  deleteVersion,
};
