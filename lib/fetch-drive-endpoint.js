'use strict'

const got = require('got')
const log = require('./log')

module.exports = (docId) => {
  log.info('driveid', docId)

  return Promise.all([
    posiblePromise(fetchUseMailDomain(docId)),
    posiblePromise(fetchUseDrive(docId))
  ])
  .then(result => {
    const [resultFromMail, resultFromDrive] = result
    if (resultFromMail !== null) {
      log.info('resultFromMail')
      return Promise.resolve(resultFromMail)
    }

    if (resultFromDrive !== null) {
      log.info('resultFromDrive')
      return Promise.resolve(resultFromDrive)
    }
    return Promise.resolve(null)
  })
}

// khai thác bằng cách sử dụng get_video_info trên miền thư
const fetchUseMailDomain = (docId) => {
  return got(`https://mail.google.com/a/e/nodeepshit.com/get_video_info?docid=${docId}`, {
    timeout: 3000,
    retries: 1,
    headers: {
      'user-agent': process.env.USER_AGENT,
      'cookie': process.env.COOKIE
    }
  })
}

// dự phòng bằng cách sử dụng get_video_info trên miền ổ đĩa
const fetchUseDrive = (docId) => {
  return got(`https://drive.google.com/get_video_info?docid=${docId}`, {
    timeout: 3000,
    retries: 1,
    headers: {
      'user-agent': process.env.USER_AGENT
    }
  })
}

// hứa rằng không bao giờ từ chối
// nó sẽ giải quyết lỗi defaultValue
const posiblePromise = (p, defaultValue = null) => {
  return new Promise(resolve => {
    p.then(resolve).catch(err => {
      log.error(err)
      resolve(defaultValue)
    })
  })
}
