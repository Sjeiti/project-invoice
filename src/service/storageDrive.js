/**
 * @module storageDrive
 * @description A provider implementation for the storage service @see storage.js
 * Check https://console.developers.google.com/apis/dashboard for keys
 */

import {loadScript} from '../util'
// import {notify} from '../components/Notification'
import {notify} from '../util/signal'
import base64 from '../util/base64'

const name = 'Google Drive'

const CLIENT_ID = '895099186053-tfjcg8i8hiahl9uon6m40406e8p230bp.apps.googleusercontent.com' // todo: move to config file
const SCOPES = 'https://www.googleapis.com/auth/drive'
const API = 'drive'
const API_VERSION = 'v3'

const tempGlobal = btoa(Date.now()).replace(/\d/g,'')
const gapiScript = 'https://apis.google.com/js/client.js?onload='

const nameMap = new Map()

let isScriptLoaded = false
let isAuthorised = false
let clientLoadResolve
let clientLoadReject

/**
 * Initialise storage provider
 * @returns {Promise}
 */
function init(){
  return new Promise((resolve,reject)=>{
    clientLoadResolve = resolve
    clientLoadReject = reject
    if (isScriptLoaded){
      handleClientLoad(false)
    } else {
      window[tempGlobal] = handleClientLoad
      loadScript(gapiScript+tempGlobal).then(()=>isScriptLoaded = true)
    }
  })
}

/**
 * Globally exposed google api callback method
 * Added as get-string on the script src
 * @param {boolean} [immediate=true]
 */
function handleClientLoad(immediate=true){
  delete window[tempGlobal]
  checkAuth(immediate) // was nextTick... seems not needed
}

/**
 * Check if the current user has authorized the application.
 * @param {boolean} [immediate=true]
 */
function checkAuth(immediate=true){
  gapi.auth.authorize(
      {client_id: CLIENT_ID,scope: SCOPES,immediate}
      ,result=>result&&!result.error?onAuthorisationSuccess(result):onAuthorisationFail(result.error)  )
}

/**
 * Authorisation success handler
 * @returns {Promise}
 */
function onAuthorisationSuccess(){
  isAuthorised = true
  return loadApi()
      .then(clientLoadResolve,clientLoadReject)
}

/**
 * Authorisation fail handler
 * @param {object} err
 */
function onAuthorisationFail(err){
  console.warn('Drive authorisation failed',err)
  isAuthorised = false
  clientLoadReject()
}

/**
 * Load the Drive API
 * @returns {Promise}
 */
function loadApi(){
  return new Promise((resolve/*,reject*/)=>gapi.client.load(API,API_VERSION,resolve))
}

/**
 * Read a file
 * @param {string} fileName
 * @returns {Promise}
 */
function read(fileName){
  return search(fileName)
      .then(
          files=>getFile(files[0].id)
          ,handleRejection
      )
}

/**
 * Write a file
 * @see https://developers.google.com/drive/v3/reference/files/update
 * @param {string} fileName
 * @param {object} data
 * @returns {Promise}
 */
function write(fileName,data){
  const fileId = nameMap.get(fileName)
  const isUpdate = !!fileId
  //
  const boundary = '-------314159265358979323846264'
  const delimiter = '\r\n--' + boundary + '\r\n'
  const close_delim = '\r\n--' + boundary + '--'
  const contentType = 'application/json'
  const metadata = {
    name: fileName
    ,mimeType: contentType
  }
  const base64Data = base64.encode(data) // regular btoa fails on chars outside Latin1 range
  const multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: ' + contentType + '\r\n' +
      'Content-Transfer-Encoding: base64\r\n' +
      '\r\n' +
      base64Data +
      close_delim
  // see: https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiclientrequestargs
  const request = gapi.client.request({
      path: `/upload/drive/v3/files${isUpdate?'/'+fileId:''}`
      ,method: isUpdate?'PATCH':'POST'
      ,params: {uploadType: 'multipart'}
      ,headers: {
        'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
      }
      ,body: multipartRequestBody})
  return new Promise((resolve,reject)=>{
    request.execute((jsonResp,rawResp)=>{
      // todo: I have no idea what an error looks like
      // success looks like {"jsonResp":{"kind":"drive#file","id":"1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc","etag":"\"z_YVnINIY56ukYDqXpOL80gtv44/MTUyMTEyNTQ0MjU1NQ\"","selfLink":"https://www.googleapis.com/drive/v2/files/1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc","webContentLink":"https://drive.google.com/uc?id=1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc&export=download","alternateLink":"https://drive.google.com/file/d/1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc/view?usp=drivesdk","embedLink":"https://drive.google.com/file/d/1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc/preview?usp=drivesdk","iconLink":"https://drive-thirdparty.googleusercontent.com/16/type/application/json","title":"foobar.json","mimeType":"application/json","labels":{"starred":false,"hidden":false,"trashed":false,"restricted":false,"viewed":true},"createdDate":"2018-03-15T14:50:42.555Z","modifiedDate":"2018-03-15T14:50:42.555Z","modifiedByMeDate":"2018-03-15T14:50:42.555Z","lastViewedByMeDate":"2018-03-15T14:50:42.555Z","markedViewedByMeDate":"1970-01-01T00:00:00.000Z","version":"2","parents":[{"kind":"drive#parentReference","id":"0AALsBMvUgAW8Uk9PVA","selfLink":"https://www.googleapis.com/drive/v2/files/1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc/parents/0AALsBMvUgAW8Uk9PVA","parentLink":"https://www.googleapis.com/drive/v2/files/0AALsBMvUgAW8Uk9PVA","isRoot":true}],"downloadUrl":"https://doc-0c-74-docs.googleusercontent.com/docs/securesc/d5banjkaa5vrb7ooft4tpq69p3v0aoqp/s0q6fre4m78gfo52faj7novils31paec/1521122400000/15368977977076157914/15368977977076157914/1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc?e=download&gd=true","userPermission":{"kind":"drive#permission","etag":"\"z_YVnINIY56ukYDqXpOL80gtv44/hTwf-KrGMHlVbgX1p17r1th0Cvk\"","id":"me","selfLink":"https://www.googleapis.com/drive/v2/files/1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc/permissions/me","role":"owner","type":"user"},"originalFilename":"foobar.json","fileExtension":"json","md5Checksum":"9e16b2f7a5e113f16b5fc452157e2e8d","fileSize":"76298","quotaBytesUsed":"76298","ownerNames":["Ron Valstar"],"owners":[{"kind":"drive#user","displayName":"Ron Valstar","picture":{"url":"https://lh3.googleusercontent.com/-RE_ayYRPceU/AAAAAAAAAAI/AAAAAAAAAAA/7B1vLrlhWaY/s64/photo.jpg"},"isAuthenticatedUser":true,"permissionId":"15368977977076157914","emailAddress":"sjeiti@gmail.com"}],"lastModifyingUserName":"Ron Valstar","lastModifyingUser":{"kind":"drive#user","displayName":"Ron Valstar","picture":{"url":"https://lh3.googleusercontent.com/-RE_ayYRPceU/AAAAAAAAAAI/AAAAAAAAAAA/7B1vLrlhWaY/s64/photo.jpg"},"isAuthenticatedUser":true,"permissionId":"15368977977076157914","emailAddress":"sjeiti@gmail.com"},"capabilities":{"canCopy":true,"canEdit":true},"editable":true,"copyable":true,"writersCanShare":true,"shared":false,"explicitlyTrashed":false,"appDataContents":false,"headRevisionId":"0BwLsBMvUgAW8K0VpVzNXVjFEd2NWZGRsZ24rdlRmZUxuU1JVPQ","spaces":["drive"]},"rawResp":"{\"gapiRequest\":{\"data\":{\"body\":\"{\\n \\\"kind\\\": \\\"drive#file\\\",\\n \\\"id\\\": \\\"1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc\\\",\\n \\\"etag\\\": \\\"\\\\\\\"z_YVnINIY56ukYDqXpOL80gtv44/MTUyMTEyNTQ0MjU1NQ\\\\\\\"\\\",\\n \\\"selfLink\\\": \\\"https://www.googleapis.com/drive/v2/files/1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc\\\",\\n \\\"webContentLink\\\": \\\"https://drive.google.com/uc?id=1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc&export=download\\\",\\n \\\"alternateLink\\\": \\\"https://drive.google.com/file/d/1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc/view?usp=drivesdk\\\",\\n \\\"embedLink\\\": \\\"https://drive.google.com/file/d/1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc/preview?usp=drivesdk\\\",\\n \\\"iconLink\\\": \\\"https://drive-thirdparty.googleusercontent.com/16/type/application/json\\\",\\n \\\"title\\\": \\\"foobar.json\\\",\\n \\\"mimeType\\\": \\\"application/json\\\",\\n \\\"labels\\\": {\\n  \\\"starred\\\": false,\\n  \\\"hidden\\\": false,\\n  \\\"trashed\\\": false,\\n  \\\"restricted\\\": false,\\n  \\\"viewed\\\": true\\n },\\n \\\"createdDate\\\": \\\"2018-03-15T14:50:42.555Z\\\",\\n \\\"modifiedDate\\\": \\\"2018-03-15T14:50:42.555Z\\\",\\n \\\"modifiedByMeDate\\\": \\\"2018-03-15T14:50:42.555Z\\\",\\n \\\"lastViewedByMeDate\\\": \\\"2018-03-15T14:50:42.555Z\\\",\\n \\\"markedViewedByMeDate\\\": \\\"1970-01-01T00:00:00.000Z\\\",\\n \\\"version\\\": \\\"2\\\",\\n \\\"parents\\\": [\\n  {\\n   \\\"kind\\\": \\\"drive#parentReference\\\",\\n   \\\"id\\\": \\\"0AALsBMvUgAW8Uk9PVA\\\",\\n   \\\"selfLink\\\": \\\"https://www.googleapis.com/drive/v2/files/1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc/parents/0AALsBMvUgAW8Uk9PVA\\\",\\n   \\\"parentLink\\\": \\\"https://www.googleapis.com/drive/v2/files/0AALsBMvUgAW8Uk9PVA\\\",\\n   \\\"isRoot\\\": true\\n  }\\n ],\\n \\\"downloadUrl\\\": \\\"https://doc-0c-74-docs.googleusercontent.com/docs/securesc/d5banjkaa5vrb7ooft4tpq69p3v0aoqp/s0q6fre4m78gfo52faj7novils31paec/1521122400000/15368977977076157914/15368977977076157914/1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc?e=download&gd=true\\\",\\n \\\"userPermission\\\": {\\n  \\\"kind\\\": \\\"drive#permission\\\",\\n  \\\"etag\\\": \\\"\\\\\\\"z_YVnINIY56ukYDqXpOL80gtv44/hTwf-KrGMHlVbgX1p17r1th0Cvk\\\\\\\"\\\",\\n  \\\"id\\\": \\\"me\\\",\\n  \\\"selfLink\\\": \\\"https://www.googleapis.com/drive/v2/files/1uMpXO4AerZpm7nZaI15lFHJp2LmScYBc/permissions/me\\\",\\n  \\\"role\\\": \\\"owner\\\",\\n  \\\"type\\\": \\\"user\\\"\\n },\\n \\\"originalFilename\\\": \\\"foobar.json\\\",\\n \\\"fileExtension\\\": \\\"json\\\",\\n \\\"md5Checksum\\\": \\\"9e16b2f7a5e113f16b5fc452157e2e8d\\\",\\n \\\"fileSize\\\": \\\"76298\\\",\\n \\\"quotaBytesUsed\\\": \\\"76298\\\",\\n \\\"ownerNames\\\": [\\n  \\\"Ron Valstar\\\"\\n ],\\n \\\"owners\\\": [\\n  {\\n   \\\"kind\\\": \\\"drive#user\\\",\\n   \\\"displayName\\\": \\\"Ron Valstar\\\",\\n   \\\"picture\\\": {\\n    \\\"url\\\": \\\"https://lh3.googleusercontent.com/-RE_ayYRPceU/AAAAAAAAAAI/AAAAAAAAAAA/7B1vLrlhWaY/s64/photo.jpg\\\"\\n   },\\n   \\\"isAuthenticatedUser\\\": true,\\n   \\\"permissionId\\\": \\\"15368977977076157914\\\",\\n   \\\"emailAddress\\\": \\\"sjeiti@gmail.com\\\"\\n  }\\n ],\\n \\\"lastModifyingUserName\\\": \\\"Ron Valstar\\\",\\n \\\"lastModifyingUser\\\": {\\n  \\\"kind\\\": \\\"drive#user\\\",\\n  \\\"displayName\\\": \\\"Ron Valstar\\\",\\n  \\\"picture\\\": {\\n   \\\"url\\\": \\\"https://lh3.googleusercontent.com/-RE_ayYRPceU/AAAAAAAAAAI/AAAAAAAAAAA/7B1vLrlhWaY/s64/photo.jpg\\\"\\n  },\\n  \\\"isAuthenticatedUser\\\": true,\\n  \\\"permissionId\\\": \\\"15368977977076157914\\\",\\n  \\\"emailAddress\\\": \\\"sjeiti@gmail.com\\\"\\n },\\n \\\"capabilities\\\": {\\n  \\\"canCopy\\\": true,\\n  \\\"canEdit\\\": true\\n },\\n \\\"editable\\\": true,\\n \\\"copyable\\\": true,\\n \\\"writersCanShare\\\": true,\\n \\\"shared\\\": false,\\n \\\"explicitlyTrashed\\\": false,\\n \\\"appDataContents\\\": false,\\n \\\"headRevisionId\\\": \\\"0BwLsBMvUgAW8K0VpVzNXVjFEd2NWZGRsZ24rdlRmZUxuU1JVPQ\\\",\\n \\\"spaces\\\": [\\n  \\\"drive\\\"\\n ]\\n}\\n\",\"headers\":{\"pragma\":\"no-cache\",\"date\":\"Thu, 15 Mar 2018 14:50:42 GMT\",\"server\":\"UploadServer\",\"etag\":\"\\\"z_YVnINIY56ukYDqXpOL80gtv44/MTUyMTEyNTQ0MjU1NQ\\\"\",\"vary\":\"Origin, X-Origin\",\"content-type\":\"application/json; charset=UTF-8\",\"cache-control\":\"no-cache, no-store, max-age=0, must-revalidate\",\"x-guploader-uploadid\":\"AEnB2Ur9cJ8iGnfY5ivXsr0y7AeCEV1iQqdD4Zu-Zpo9U00WHBcfD52rPM5azb2RUu9ZsY5CkyborGJLQ7e7xqBb4ens4uVBDA\",\"content-length\":\"3105\",\"expires\":\"Mon, 01 Jan 1990 00:00:00 GMT\"},\"status\":200}}}"}
      !isUpdate&&mapFile(jsonResp)
      jsonResp?resolve(jsonResp):reject(rawResp)
    })
  })
}

/**
 * Get a file by id
 * @param {string} fileId
 * @returns {Promise}
 */
function getFile(fileId){
  return new Promise((resolve,reject)=>
    gapi.client.drive.files.get({fileId,alt:'media'}).then(response=>
      response.status===200?resolve(response.body):reject(response)
    )
  )
}

/**
 * Search a file by name
 * @see https://developers.google.com/drive/v3/web/search-parameters
 * @param {string} fileName
 * @returns {Promise}
 */
function search(fileName){
  return new Promise((resolve,reject)=>{
    gapi.client.drive.files.list({
      pageSize: 10
      ,q: `name = '${fileName}' and trashed = false`
    }).then(response=>{
      const files = response.result.files
      const file = files.slice(0).pop()
      const isFound = !!file
      isFound&&mapFile(file)
      isFound?resolve(files):reject()
    },reject)
  })
}

/**
 * Write fileName/fileId to map
 * @param {fileResource} file
 */
function mapFile(file){
  nameMap.set(file.name,file.id)
}

/**
 * Handle gapi method promise rejection
 * For instance on gapi.client.drive.files.list
 * @param {responseObject} response
 */
function handleRejection(response){
  const {error} = response.result
  error&&notify.dispatch(`Error ${error.code}: ${error.message}`)
  // error&&notify(`Error ${error.code}: ${error.message}`)
}

export default {
  name
  ,init
  ,get authorised(){
 return isAuthorised
}
  ,read
  ,write
}

/**
 * @typedef {object} fileResource
 * @see https://developers.google.com/drive/v3/reference/files#resource
 * @property {string} id
 * @property {string} kind
 * @property {string} mimeType
 * @property {string} name
 */

/**
 * @typedef {object} responseObject
 * @property {string} body
 * @property {object} headers
 * @property {object} result
 * @property {number} status
 * @property {string} statusText
 */