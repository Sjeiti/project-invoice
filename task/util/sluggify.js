/**
 * Sluggifies
 * @todo duplicate in build
 * @param {string} s
 * @returns {string}
 */
module.exports = function sluggify(s){
  const slug = s.replace(/^\s*|[^a-zA-Z0-9\s]|\s*$/g,'').replace(/\s(\w)/g,(match,s)=>s.toUpperCase())
  return slug[0].toLowerCase()+slug.substr(1)
}
