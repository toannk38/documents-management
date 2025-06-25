const { DocumentWorkflow } = require('../models');

const createWorkflow = async (data) => DocumentWorkflow.create(data);
const getWorkflowsByDocument = async (documentId) => DocumentWorkflow.findAll({ where: { document_id: documentId } });
const updateWorkflow = async (id, data) => DocumentWorkflow.update(data, { where: { id } });
const deleteWorkflow = async (id) => DocumentWorkflow.destroy({ where: { id } });

module.exports = {
  createWorkflow,
  getWorkflowsByDocument,
  updateWorkflow,
  deleteWorkflow,
};
