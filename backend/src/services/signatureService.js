const { DigitalSignature } = require('../models');

const createSignature = async (data) => DigitalSignature.create(data);
const getSignaturesByDocument = async (documentId) => DigitalSignature.findAll({ where: { document_id: documentId } });

module.exports = {
  createSignature,
  getSignaturesByDocument,
};
