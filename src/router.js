import React from 'react'
import {
	Route,
	Switch,
	withRouter,
	BrowserRouter
} from 'react-router-dom'

import App from './App'
import Content from './Content'


const Router = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path='/' component={withRouter(App)} />
				<Route exact path='/content' component={withRouter(Content)} />
			</Switch>
		</BrowserRouter>
	)
}

export default Router