/**
 * Sluggifies
 * @param {string} s
 * @returns {string}
 */
module.exports = function sluggify(s){
  const slug = s
      .replace(/^[^a-zA-Z]*|[^a-zA-Z0-9\s]|[^a-zA-Z0-9]*$/g,'')
      .replace(/\s(\w)/g,(match,s)=>s.toUpperCase())
  return slug&&slug[0].toLowerCase()+slug.substr(1)
}
