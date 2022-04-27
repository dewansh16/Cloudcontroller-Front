import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AppRoute from './Controllers/appRoute'
import routes from './Utils/paths/path';
import ErrorPage from './Views/ErrorPage/ErrorPage';
import './App.less';

function App() {
  <Helmet>
    <title>
      Live247
    </title>
  </Helmet>
  return (
    <Router>
      <Switch>
        {routes.map((route) => {
          return (
            <AppRoute
              key={route.id}
              exact={route.exact}
              path={route.path}
              component={route.component}
              IsPrivate={route.isPrivate}
            />
          )
        })}
        <AppRoute path="*" component={ErrorPage} />
      </Switch>
    </Router>
  );
}

export default App;
