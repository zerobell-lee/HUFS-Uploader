import React, {Component} from 'react';
import { Route } from 'react-router-dom';
import { Uploader, Login } from '../pages';

class App extends Component {
    render() {
        return (
            <div>
                <Route exact path="/" component={Login} />
                <Route excat path="/write" component={Uploader} />
            </div>
        )
    }
}

export default App;