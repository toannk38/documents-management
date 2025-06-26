const { DocumentCategory } = require('../models');

module.exports = async () => {
  await DocumentCategory.bulkCreate([
    { name: 'Contract', description: 'Legal contracts' },
    { name: 'Policy', description: 'Company policies' },
    { name: 'Agreement', description: 'Agreements with partners' },
  ], { ignoreDuplicates: true });
};
