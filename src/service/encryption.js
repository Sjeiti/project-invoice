import CryptoJS from 'crypto-js'
import {tryParse} from '../util'

console.log('zxcv',CryptoJS.AES.encrypt('asdf','qwer').toString()) // todo: remove log
const asdf = encryptObject({asdf:23},'qwer')
console.log('asdf',asdf) // todo: remove log
const qwer = decryptObject(asdf,'qwer')
console.log('qwer',qwer) // todo: remove log

export function isEncrypted(string){ // or rather isNotJsonString
    return string&&string.match(/^[\w+/=]+$/)
    // return string&&string.substr(0,1)!=='{'
}

export function decrypt(hash,key){
    let rawData
    try {
      rawData = CryptoJS.AES.decrypt(hash,key).toString(CryptoJS.enc.Utf8)
      // console.log('rawData',rawData) // todo: remove log
    } catch(err){
      // console.warn('err',err) // todo: remove log
    }
    return rawData
}

export function encrypt(string,key){
    return CryptoJS.AES.encrypt(string,key).toString()
}

export function decryptObject(hash,key){
    return tryParse(decrypt(hash,key))
}

export function encryptObject(obj,key){
    return encrypt(JSON.stringify(obj),key)
}