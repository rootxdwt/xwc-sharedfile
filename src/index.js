import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App, File, Menu} from './App';
import { decode } from 'base64-arraybuffer';
import {decode as urldecode} from 'url-safe-base64'

function calchunk(filelength) {
  var chunkcount
  chunkcount = parseInt(filelength / ((1024 * 1024)*5));
  if((filelength%((1024 * 1024)*5))>0) {
      chunkcount = chunkcount + 1;
  }
  return chunkcount;
}
if(window.location.pathname.split('/').length < 4) {
  document.location.href="https://xdcs.me"
}else {
  if(window.location.pathname.split('/')[3].length % 22 !=0 || window.location.pathname.split('/')[3].length == 0) {
    ReactDOM.render(
      <App stc={1} name={"No cryptokey found"}/>,
    document.getElementById('root')
  );
  }else {
    var id = window.location.pathname.split('/')[2]
    var cryptokeyab = decode(urldecode(window.location.pathname.split('/')[3]))
    var form = new FormData();
    form.append("id", id)
    
    fetch('https://xdcs.me/api/udfetch', {method: 'POST', body: form, headers:{'X-XWC-act': 'sf'}}).then(function(resp) {
      if(resp.ok) {
        return resp.json()
      }
    }).then(function(json) {
        var encryptedfilekey = decode(json.Filekey).slice(16)
        var filekeyiv = decode(json.Filekey).slice(0,16)
        var encryptedfilename = decode(json.Name).slice(16)
        var filenameiv = decode(json.Name).slice(0,16)
        var finishlist = []
        crypto.subtle.importKey(
          "raw",
          cryptokeyab,
          {name: 'AES-CBC'},
          false,
          ["encrypt", "decrypt"]
      ).then(function(key) {
        crypto.subtle.decrypt(
            {name: 'AES-CBC', 
            iv: filekeyiv
        }, key, encryptedfilekey).then(function(decryptedfilekey) {
            crypto.subtle.decrypt(
              {name: 'AES-CBC', 
              iv: filenameiv
          }, key, encryptedfilename).then(function(decryptedfilename) {
            var dec = new TextDecoder();
            var dtyp = dec.decode(decryptedfilename).split('.')
            ReactDOM.render(
              <App name={dec.decode(decryptedfilename)}/>,
            document.getElementById('root')
          );
          var nth = 0;
            viewfile(id, (((1024 * 1024)*5) + 48)*(nth)+":"+(((1024 * 1024)*5) + 48)*(nth+1), decryptedfilekey, nth, dtyp, false)
        var now = 0;
        var currentupload = 0;
        var bloblist = []
        var finalblob = new Blob([])
        function viewfile(element, range, deckey, nth, extension) {
          function callback(data) {
            crypto.subtle.importKey("raw", deckey, {name:"AES-CBC"}, false, ["encrypt", "decrypt"]).then(function(impk) {
              var fileiv = data.slice(0, 16)
              var filedata = data.slice(32)
              crypto.subtle.decrypt (
                {name: 'AES-CBC', 
                iv: fileiv
            }, impk, filedata).then(function(decryptedfilechunk) {
              finishlist.push(nth)
              var newu8 = new Uint8Array(decryptedfilechunk)
              var preblob = new Blob([newu8])
              bloblist[nth] = preblob
              finalblob = new Blob(bloblist)
              if(finalblob.size == json.Size) {
                  var finurl = URL.createObjectURL(new Blob([finalblob]))
                  const imgs = ['jpg', 'jpeg', 'png', 'bmp', 'svg', 'webp', 'gif'];
                  const vid = ['mp4', 'avi', 'mov', 'wwv', 'flv'];
                  const audio = ['mp3', 'm4a', 'ogg', 'wav']
                  var fileextension
                  if(imgs.indexOf(extension[extension.length - 1].toLowerCase()) !== -1) {
                      fileextension = "img"
                  }
                  else if(vid.indexOf(extension[extension.length - 1].toLowerCase()) !== -1) {
                      fileextension = "vid"
              
                  }else if(audio.indexOf(extension[extension.length - 1].toLowerCase()) !== -1){
                      fileextension = "audio"
              
                  }else {
                      fileextension = "idk"
                  }
                  ReactDOM.render(
                    <File ft={fileextension} src={finurl} name={dec.decode(decryptedfilename)}/>,
                    document.querySelector('.filearea')
                  )
                  ReactDOM.render(
                    <Menu src={finurl} name={dec.decode(decryptedfilename)}/>, 
                    document.querySelector('.om')
                  )
              }else {
                viewfile(id, (((1024 * 1024)*5) + 48)*(nth+1)+":"+(((1024 * 1024)*5) + 48)*(nth+2), decryptedfilekey, nth+1, dtyp, false)
              }
            })
            })
          }
          var xhr = new XMLHttpRequest();
          xhr.open("POST", "https://storage.xdcs.me/vf/"+element+"/"+range, true)
          xhr.setRequestHeader("X-XWC-act", "sf")
          xhr.responseType = "arraybuffer";
          xhr.onreadystatechange = function() {
              if (xhr.readyState === xhr.DONE) {
                  if (xhr.status === 200) {
                      callback(xhr.response);
                  }else {
                    document.querySelector('.filearea').innerText="ERROR: "+xhr.statusText
                  }
              }
          };
          xhr.onprogress = function(e) {
                  currentupload = e.loaded
                  var p = Math.round(((now+currentupload)/json.Size)*100)
                  document.querySelector('.filearea').innerText="Downloaded "+p+"%"
          }
          xhr.onloadend = function() {
              now = currentupload + now
          }
      
          xhr.send();
        }
          })
        }).catch(function(err) {
          console.log(err)
        })
      }).catch(function(err) {
        console.log(err)
      })
    })
  }
  
}