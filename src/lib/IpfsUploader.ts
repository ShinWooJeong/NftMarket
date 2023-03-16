// // 먼저 이미지만 IPFS에 업로드 //const type = extension[1]
// let fd = new formData()
// let loadedFile = await fs.createReadStream(`./${fileName}`) //await fs.promises.readFile(`./nftcontent.${extension[1]}`)
// await fd.append("file", loadedFile)
// contentType = "multipart/form-data; boundary=" + fd.getBoundary()
// config = await setConfig(fd, contentType)
// await postAxios(config)
