# xwcloud shared file viewer

source of xwcloud's shared file viewer

## how does it work

1-0. basic url structure
`https://xdcs.me/share/{file id}/{filekey}`
the filekey is a exported 128bit AES key encoded in url safe base64(it is generated when you press the share button in the file options at the console)

## credits
built with reactjs by rootxdwt
 ### packages used
 - react-syntax-highlighter https://www.npmjs.com/package/react-syntax-highlighter
 - filename2prism https://www.npmjs.com/package/filename2prism
 - copy-text-to-clipboard https://www.npmjs.com/package/copy-text-to-clipboard
 - base64-arraybuffer https://www.npmjs.com/package/base64-arraybuffer
 - url-safe-base64 https://www.npmjs.com/package/url-safe-base64
