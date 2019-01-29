import React, { Component } from 'react';
import './App.css';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer = electron.ipcRenderer;

class App extends Component {
  state = { txtValue: "Hello", loading: false }

  constructor(props) {
    super(props)
    this.setTextArea = this.setTextArea.bind(this)
    ipcRenderer.on('SetTextArea', this.setTextArea)
    this.uploadImgs = this.uploadImgs.bind(this)
    this.fileInput = React.createRef()
    ipcRenderer.on('log', (event, arg) => {
      console.log(arg)
    })
    this.handleChange = this.handleChange.bind(this)
  }

  setTextArea = (event, value) => {
    this.setState({txtValue: value, loading: false})
  }

  handleChange = (e) => {
    this.setState({txtValue: e.target.value})
  }

  uploadImgs = (e) => {
    e.preventDefault();
    console.log('Started upload')
    var pathArr = []

    for (var i = 0; i < this.fileInput.current.files.length; i++) {
      pathArr[i] = this.fileInput.current.files[i].path
    }

    console.log(pathArr)
    ipcRenderer.send('upload', pathArr)
    console.log('Ended')
    this.setState({loading: true})
  }

  render() {
    return (
      <div className="App">
        <div id="container">
          <div className="row">
            <input type="file" multiple={true} ref={this.fileInput}/>
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



export default App;
