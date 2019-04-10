import React, {Component} from 'react';
import './Login.css';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class Login extends Component {

    state = {loading : false, id : '', pwd : ''}

    constructor(props) {
        super(props)
        this.checkLogin = this.checkLogin.bind(this)
        this.handleId = this.handleId.bind(this)
        this.handlePwd = this.handlePwd.bind(this)
        ipcRenderer.on('login result', (event, arg) => {
            if (arg.success===true) {
            this.props.history.push('/write')
            }
            else {
                alert('Login failed')
            }
        })
        ipcRenderer.on('view cookie', (event, arg) => {
            console.log(arg)
        })
    }

    checkLogin = (event) => {
        event.preventDefault()
        var id = this.state.id
        var pwd = this.state.pwd
        var alertMsg = ''

        if (id === '') {alertMsg += '* 아이디가 공란입니다. 다시 한번 확인해주세요.\n'}
        if (pwd === '') {alertMsg += '* 비밀번호가 공란입니다. 다시 한번 확인해주세요.\n'}

        if (alertMsg === '') {
            ipcRenderer.send('login', {id: this.state.id, pwd: this.state.pwd})
        }
        else {
            alert(alertMsg)
        }
        //Send Login request to ipcMain
        //Make state Loading
    }

    handleId = (event) => {
        this.setState({id: event.target.value})
    }

    handlePwd = (event) => {
        this.setState({pwd : event.target.value})
    }

    render = () => {
        return(
        <div className="container">
            <label><b>학번</b></label>
            <input type="text" value={this.state.id} onChange={this.handleId} placeholder="id"/>
            <label><b>비밀번호</b></label>
            <input type="password" value={this.state.pwd} onChange={this.handlePwd} placeholder="password"/>
            <button onClick={this.checkLogin}>Login</button>
        </div>
        )
    }
}

export default Login;