# xwcloud shared file viewer

source of xwcloud's shared file viewer

## how does it work

1-0. basic url structure
`https://xdcs.me/share/{file id}/{filekey}`
the filekey is a exported 128bit AES key encoded in url safe base64(it is generated when you press the share button in the file options at the console)

1-1. how does it ACTUALLY work
> - First, your browser will parse the url and check for the file id, key. If the file id is not correct or the key is invalid the page will
  automatically redirect you to `https://xdcs.me`
> - Second, if everything is valid and good to go, the page will start downloading 5MB chunks from our download endpoint and decrypt each of it.
> - Third, if the file size and the decrypted file size is the same, the page will wrap up the downloading progress and display the final result on your screen.

1-2. more detail for nerds
> - the page will create blob(binary large object) from each of the 5mb chunks downloaded, and will append it to a giant list of blobs which will be the final blob
  i used to create a giant uint8array with the size of the original file, and set the decrypted data with the correct offset but i figured out this method will easily exceed the
  memory limit of modern browsers.
> - the page will only make one connection per chunk with the download endpoint. Also no connection will be created if the previous connection is not finished.
  this is because of the bug in chrome. (idk is this really a bug or not tbh) Chrome wont update the xhr-accessable loaded byte size if lots and lots of simultaneous requests
  are going on in the same time.
> - As you know, we generate different keys per file. Lets call this inner-key.
  the inner key is a 256bit AES key which means your files are encrypted in 256bit AES. then we encrypt the inner key
  with your personal private key(stored in your browser) client-side. this encrypted key will be stored in our server.
  in the sharing progress, we downloads the encrypted key from the server and decrypt it with your personal key. Then we generate a new 128bit AES key
  and encrypt the decrypted key with the generated key. the 128bit AES key in the shared url is the generated key encoded in urlsafe base64.
  
  
## known issues
there are some issues but i forgot

## credits
built with reactjs by rootxdwt
 ### packages used
 - react-syntax-highlighter https://www.npmjs.com/package/react-syntax-highlighter
 - filename2prism https://www.npmjs.com/package/filename2prism
 - copy-text-to-clipboard https://www.npmjs.com/package/copy-text-to-clipboard
 - base64-arraybuffer https://www.npmjs.com/package/base64-arraybuffer
 - url-safe-base64 https://www.npmjs.com/package/url-safe-base64
