const { SystemSetting } = require('../models');

module.exports = async () => {
  await SystemSetting.bulkCreate([
    { key: 'site_name', value: 'Legal Docs Management', description: 'Name of the site' },
    { key: 'default_language', value: 'en', description: 'Default language' },
  ], { ignoreDuplicates: true });
};
