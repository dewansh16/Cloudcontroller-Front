import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import { UserStore } from '../Stores/userStore'
export default function AppRoute({ component: Component, IsPrivate: isPrivate, ...rest }) {

    const { user } = UserStore.getUser();
    return (
        <Route {...rest} render={(props) => {
            if (isPrivate) {
                if (user !== undefined) {
                    return <Component {...props} />;
                }
                else return <Redirect to={{ pathname: "/", state: { from: props.location } }} />
            } else
                return (
                    <Component  {...props} />
                );
        }
        }

        />
    );
}


