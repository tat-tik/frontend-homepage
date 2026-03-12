const fileSize = (byteSize, flag = true) => {
  const size = byteSize / 1048576
  if(flag)
    return size > 1 ? `${size.toFixed(2)} MB` : `${(size * 1024).toFixed(2)} KB`
  else {
    return size > 1 ? size.toFixed(2) : (size * 1024).toFixed(2)
  }
}

export default fileSize;