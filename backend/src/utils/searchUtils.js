const buildLikeQuery = (field, term) => ({ [field]: { $like: `%${term}%` } });
const highlight = (text, term) => text.replace(new RegExp(term, 'gi'), match => `<mark>${match}</mark>`);

module.exports = {
  buildLikeQuery,
  highlight,
};
