
import React, { Component } from 'react';
import FileDrop from 'react-file-drop';
import './Uploader.css';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class Uploader extends Component {
  state = { txtValue: "Hello", loading: false, title: "", name: "학생회", files: [] }

  constructor(props) {
    super(props)
    
    this.setTextArea = this.setTextArea.bind(this)
    this.uploadImgs = this.uploadImgs.bind(this)
    this.fileInput = React.createRef()

    ipcRenderer.on('SetTextArea', this.setTextArea)
    ipcRenderer.on('log', (event, arg) => {
      console.log(arg)
    })
    this.handleChange = this.handleChange.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
  }

  setTextArea = (event, value) => {
    this.setState({txtValue: value, loading: false})
  }

  handleChange = (e) => {
    this.setState({txtValue: e.target.value})
  }

  handleTitleChange = (e) => {
    this.setState({title: e.target.value})
  }

  handleNameChange = (e) => {
    this.setState({name: e.target.value})
  }

  handleDrop = (uploadedFiles, e) => {
    let { files } = this.state
    let fileArray = [...uploadedFiles]
    console.log(fileArray)
    files.push(...fileArray)
    console.log(files)
    this.setState({files})
  }

  uploadImgs = (e) => {
    e.preventDefault();
    console.log('Started upload')
    var pathArr = []

    for (var i = 0; i < this.fileInput.current.files.length; i++) {
      pathArr[i] = this.fileInput.current.files[i].path
    }

    console.log(pathArr)
    ipcRenderer.send('upload', {pathArr: pathArr, title: this.state.title, name: this.state.name})
    console.log('Ended')
    this.setState({loading: true})
  }

  render() {
    return (
      <div className="App">
        <header>Hello</header>
        <div id="container">
          <div className="row">
            <input type="text" maxLength="45" placeholder="Title" onChange={this.handleTitleChange} value={this.state.title}/>
          </div>
          <div className="row">
            <input type="text" maxLength="45" placeholder="Name" onChange={this.handleNameChange} value={this.state.name}/>
          </div>
          <div className="row">
            {
              //<input type="file" multiple={true} ref={this.fileInput}/>
            }
            <FileDrop onDrop={this.handleDrop}>
              {this.state.files.length === 0 && '파일 올려주세염'}
              {this.state.files.map((e) => {
                return (
                  <p>{e.name}</p>
                )
                })
              }
            </FileDrop>
          </div>
          <div className="row">
            <button onClick={this.uploadImgs}>Submit</button>
          </div>
          <div className="row">
            <textarea value={this.state.txtValue} cols={45} rows={5} onChange={this.handleChange}/>
          </div>
          {this.state.loading&&<div id="loader-bg"></div>}
          {this.state.loading&&<div id="loader"></div>}
        </div>
      </div>
    );
  }
}



export default Uploader;
