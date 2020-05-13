import {getStorage, setStorage} from './localStorage'

const storageName = 'fontList'
const fontList = []

export function getFontList(apiKey){
  return new Promise((resolve, reject)=>{
    if (fontList.length) {
      resolve(fontList)
    } else {
      const stored = getStorage(storageName)
      if (stored) {
        fontList.push(...stored)
        resolve(fontList)
      } else {
        fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`)
            .then(response=>response.json())
            .then(result=>{
              setStorage(storageName, result.items)
              fontList.push(...result.items)
              resolve(fontList)
            })
      }
    }
  })
}