const { Document } = require('../models');
const { v4: uuidv4 } = require('uuid');

module.exports = async () => {
  await Document.bulkCreate([
    {
      document_number: 'DOC-001',
      title: 'Sample Document 1',
      document_type: 'Contract',
      status: 'active',
      created_by: null, // Set to a valid user UUID if available
    },
    {
      document_number: 'DOC-002',
      title: 'Sample Document 2',
      document_type: 'Policy',
      status: 'inactive',
      created_by: null, // Set to a valid user UUID if available
    },
  ], { ignoreDuplicates: true });
};
