import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAL74boAS3ZKA2lckDuEqlX59SkU65BPQ\n' +
  'mIL0z+8LIqq5u19y4/3JpgJW2VAgAfJl9ypv8DuFTFI0JrpmM4Sr3pcCAwEAAQ=='

const privateKey = 'MIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEAvvhugBLdkoDaVyQO\n' +
  '4SqVfn1KRTrkE9CYgvTP7wsiqrm7X3Lj/cmmAlbZUCAB8mX3Km/wO4VMUjQmumYz\n' +
  'hKvelwIDAQABAkBL6S7rhBRFfyjLiM7NXIMOQ7l5KX6uDbYCIFRjXhbKq9dD8iY3\n' +
  'Ly/wbkZP9K6zBsCvBw3KlKPQDGhZFnhrbSgxAiEA8W4Nnffg3Bf3sIm4PowManP1\n' +
  'exrH8IzfwK+iJAiuFLkCIQDKfs9kdCIqqjW906vyD4jjefoSNtECJJbamAJlr82F\n' +
  'zwIgCCBqOO0FFqN/5ONd3k0cheDNXI10OXakeXnv/UKFiZECIFl2MPY2gKnMzTVy\n' +
  'gPLOfjHRv/OwGCMUOzmUEusOAoTtAiBz/2/I1qFkmV7yrVMiOz2D00BsYqx86pyf\n' +
  '+l6po8AF4Q=='

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}

