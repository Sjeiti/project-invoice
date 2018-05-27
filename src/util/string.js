/**
 * Sluggifies
 * @todo duplicate in build
 * @param {string} s
 * @returns {string}
 */
export function sluggify(s){
  const slug = s
      .replace(/^[^a-zA-Z]*|[^a-zA-Z0-9\s]|[^a-zA-Z0-9]*$/g,'')
      .replace(/\s(\w)/g,(match,s)=>s.toUpperCase())
  return slug&&slug[0].toLowerCase()+slug.substr(1)
}

/**
 * Extract the key and filters from a value
 * @param {string} s
 * @returns {string[]}
 */
export function getFilters(s){
  return s.split(/\s*\|\s*/g)
    .map(s=>s.split(/\s/))
    .reduce((a,b)=>{
      if (!a.key){
        a.key = b.pop()
        a.filters = []
      } else {
        const filter = {
          name: b.shift()
          ,params: b
        }
        a.filters[filter.name] = filter.params
        a.filters.push(filter)
      }
      return a
    },{})
}
