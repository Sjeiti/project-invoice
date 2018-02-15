const proto = {
  /**
   * Returns an exact clone of the project
   * @returns {Project}
   */
  clone(){
      return create(JSON.parse(JSON.stringify(this)))
  }
}

export function create(config){
    return Object.setPrototypeOf(config, proto);
}
