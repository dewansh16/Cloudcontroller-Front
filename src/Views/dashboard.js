import React from 'react'
import { Switch, useRouteMatch, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet';
import AppRoute from '../Controllers/appRoute'
import { Layout } from 'antd';
import Config from '../Lib/config';
import { UserStore } from '../Stores/userStore';
import SideDrawer from './Components/sideDrawer';
import adminRoutes from '../Utils/paths/adminRoutes'
import patientRoutes from '../Utils/paths/patientRoutes'
import needHelpRoute from '../Utils/paths/needHelpRoute';
import userRoutes from '../Utils/paths/userRoutes';
import ErrorPage from './ErrorPage/ErrorPage';
const { Content } = Layout;


function Dashboard() {
    let { url } = useRouteMatch();
    const user = UserStore.getUser();
    const { ROLES } = Config;
    return (
        <>
            <Helmet>
                <title>
                    Dashboard
                </title>
            </Helmet>
            <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                <SideDrawer />
                <Layout className="site-layout" style={{ width: "calc(100% - 68px)" }}>
                    <Content>
                        {/* Dashboard related routes */}
                        <Switch>
                            {(ROLES.ADMIN.includes(user.role.toLowerCase()) || ROLES.SUPER_ADMIN.includes(user.role.toLowerCase())) && adminRoutes?.map((route) => {
                                return (
                                    <AppRoute
                                        key={route.id}
                                        path={url + route.path}
                                        exact={route.exact}
                                        isPrivate={route.isPrivate}
                                        component={route.component}
                                    />
                                );
                            })
                            }
                            {(ROLES.SUPER_ADMIN.includes(user.role.toLowerCase()) || ROLES.MEDICS.includes(user.role.toLowerCase())) && patientRoutes?.map((route) => {
                                return (
                                    <AppRoute
                                        key={route.id}
                                        path={url + route.path}
                                        exact={route.exact}
                                        isPrivate={route.isPrivate}
                                        component={route.component}
                                    />
                                );
                            })
                            }
                            {needHelpRoute?.map((route) => {
                                return (
                                    <AppRoute
                                        key={route.name}
                                        path={url + route.path}
                                        exact={route.exact}
                                        isPrivate={route.isPrivate}
                                        component={route.component}
                                    />
                                );
                            })
                            }
                            {userRoutes?.map((route) => {
                                return (
                                    <AppRoute
                                        key={route.name}
                                        path={url + route.path}
                                        exact={route.exact}
                                        isPrivate={route.isPrivate}
                                        component={route.component}
                                    />
                                );
                            })
                            }
                            <AppRoute path="*" component={ErrorPage} />
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        </>
    );

}
export default withRouter(Dashboard);
