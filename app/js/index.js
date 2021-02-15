
import '../css/styles.scss';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useLocation } from 'react-router-dom'


import Login from './login'




const Tree = () => {

    return (
    <BrowserRouter>
            <Switch>
            <BrowserRouter basename='/gps/web'>

                <Route exact path='/' component={Login} />

                {/*<Route component={() => <p>No funciona  </p>} />*/}
            </BrowserRouter>
            </Switch>
    </BrowserRouter>

    )


}

ReactDOM.render(<Tree/>, document.getElementById('pagina'));





function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}
  
const images = importAll(require.context('../img/', false, /\.(png|jpg|svg)$/));