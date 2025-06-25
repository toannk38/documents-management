const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
const truncate = (str, len) => str.length > len ? str.slice(0, len) + '...' : str;
const toCamelCase = (str) => str.replace(/[-_](.)/g, (_, c) => c.toUpperCase());

module.exports = {
  capitalize,
  slugify,
  truncate,
  toCamelCase,
};
