import React from 'react';
import ReactDOM from 'react-dom';
import copy from 'copy-text-to-clipboard';
import filename2prism from 'filename2prism';
import SyntaxHighlighter from "react-syntax-highlighter";
import { arta } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function copyurl() {
  copy(window.location.href)
}
export class Menu extends React.Component {
  render() {
    var text
    if(this.props.src) {
      text = "Download"
    }else {
      text="Loading.."
    }
    return(
      <>
      <div className="foption">
        <li>
          <a href={this.props.src} download={this.props.name}>
           {text}
          </a>
        </li>
        <li onClick={copyurl}>
          Copy link
        </li>
        <li>
          File information(wip)
        </li>
      </div>
      </>
    )
  }
}
ReactDOM.render(
  <Menu />, 
  document.querySelector('.om')
)
function showfileoptions(clickxloc, clickyloc) {
  document.querySelector(".foption").style="display: block"
}
function hidefileoptions(target) {
  if(target != "Layer_1") {
    document.querySelector(".foption").style="display: none"
  }
}
export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {progress: 0};
  }
  render() {
    var innertxt
    if(this.props.stc == 1) {
      innertxt = "oops something went wrong"
    }else {
      innertxt = "Preparing.."
    }
    return(
      <>
      <div className="dark" onClick={(e)=>hidefileoptions(e.target.id)}>
    <div className="header">
      <div className="filenamelabel">{this.props.name}</div>
      <div className="headerleft">
      <svg version="1.1" x="0px" y="0px" viewBox="0 0 720 720" width="30">
            <path id="loadwrapperloading" d="M584.1,307.5c0-1.4,0.1-2.8,0.1-4.2c0-68.5-55.5-124.1-124.1-124.1c-32.4,0-61.9,12.5-84,32.8 c-22.7-26.1-56.2-42.7-93.6-42.7c-68.5,0-124.1,55.5-124.1,124.1c0,4.8,0.3,9.5,0.8,14.1c-2.5-0.2-5-0.3-7.6-0.3 c-62.9,0-113.9,49.3-113.9,110.2c0,60.9,51,110.2,113.9,110.2h425.7c58.5,0,105.9-49.3,105.9-110.2 C683.3,359,639.4,311.2,584.1,307.5z">
        </path><g></g><g></g><g></g><g></g></svg>
      <svg version="1.1" id="Layer_1" x="0px" y="0px"viewBox="0 0 100 100" width="20px" onClick={(e)=>showfileoptions(e.clientX, e.clientY)}>
      <circle cx="50" cy="17.5" r="9.92"/>
      <circle cx="50.21" cy="49" r="9.92"/>
      <circle cx="50" cy="80.51" r="9.92"/>
    </svg>
        </div>
    </div>
    <div className="filearea">{innertxt}</div>
  </div>
  </>
    )
  }
  
}
export class File extends React.Component {
  constructor(props) {
    super(props);
    this.state = {sc: -1};
    this.state = {vh: -1};
  }
  imgload() {
    if(document.querySelector(".viewerimage").width > window.innerWidth) {
        this.setState({
            sc: window.innerWidth
          })
    }else {
        this.setState({
            sc: document.querySelector(".viewerimage").width
          })
    }
  }
  vidload() {
    if(document.querySelector(".viewervid").videoWidth > window.innerWidth) {
        this.setState({
            sc: window.innerWidth
          })
    }else if((document.querySelector(".viewervid").videoWidth <= window.innerWidth)) {
        this.setState({
            sc: document.querySelector(".viewervid").videoWidth
          })
    }
    if(document.querySelector(".viewervid").videoHeight > window.innerHeight) {
      this.setState({
          vh: window.innerHeight
        })
    }else if(document.querySelector(".viewervid").videoHeight <= window.innerHeight){
      this.setState({
        vh: document.querySelector(".viewervid").videoHeight
      })
    }
  }
  listner(e) {

    if(!(this.state.sc < 100) || (e.deltaY/-100) == 1) {
      this.setState({
          sc: ((this.state.sc) + 70*(e.deltaY/-100))
        });
    }
}
  render() {
    var type
    var codetype = filename2prism(this.props.name)
    if(codetype.length != 0) {
        var xhr = new XMLHttpRequest();
        xhr.open( "GET",this.props.src, false)
        xhr.send()
      type = <SyntaxHighlighter style={arta} language={codetype[0].toLowerCase()} showLineNumbers={true} lineNumberContainerStyle={{marginLeft:"10px"}}customStyle={{position: "absolute",bottom: "0", display: "block", padding: "0",background: "transparent",marginBottom:"0", color: "rgb(170, 170, 170)", height: "calc(100% - 50px)", width: "100vw"}}>{xhr.responseText}</SyntaxHighlighter>
      if(xhr.response.length > 102400) {
          type = <div className="noprevdownload"><div className="downloadlabel">This File Is Too Big For Preview</div><a className="downloadbtn" href={this.props.src} download={this.props.name}>Download</a></div>
      }
    }else {
      if(this.props.ft == "img") {
        type = <img className="viewerimage"src={this.props.src} width={this.state.sc} onWheel={(e)=>{this.listner(e)}} onLoad={()=>{this.imgload()}}></img>
      }else if(this.props.ft == "vid") {
        type = <video width={this.state.sc} height={this.state.vh} className = "viewervid" onLoadedMetadata={()=>{this.vidload()}} controls><source src={this.props.src} type={this.props.mime}/></video>
      }else if (this.props.ft == "audio"){
        type = <audio controls><source src={this.props.src} type={this.props.mime} /></audio>
      }else{
        type = <div className="noprevdownload"><div className="downloadlabel">No Preview Is Avalible For This Type Of File</div><a className="downloadbtn" href={this.props.src} download={this.props.name}>Download</a></div>
        //<iframe src={this.props.src} title={this.props.name} frameborder="0" border="0" cellspacing="0"></iframe>
      }
    }
    return(type)
  }
}
