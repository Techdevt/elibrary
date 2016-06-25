 import React from 'react';
 import MainLayout from 'containers/MainLayout';

class AppLayout extends React.Component {
    render() {
       const {user, notify, menu, dispatch, Account} = this.props;
       
       return (
        <MainLayout
          showFooter={true} style={{height: '100%'}} notify={notify} menu={menu} dispatch={dispatch} Account={Account}>
          {this.props.children && React.cloneElement(this.props.children, {
              user
          })}
      </MainLayout>
      );
    }
}

export default AppLayout;