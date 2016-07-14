 import React, { PropTypes } from 'react';
 import MainLayout from 'containers/MainLayout';

 const AppLayout = ({ user, notify, menu, dispatch, Account, children }) => (
   <MainLayout
     showFooter
     style={{ height: '100%' }}
     notify={notify}
     menu={menu}
     dispatch={dispatch}
     Account={Account}
   >
   {
     children && React.cloneElement(children, {
       user,
     })
   }
   </MainLayout>
 );

 AppLayout.propTypes = {
   user: PropTypes.object,
   notify: PropTypes.func,
   menu: PropTypes.object,
   dispatch: PropTypes.func,
   Account: PropTypes.object,
   children: PropTypes.object.isRequired,
 };

 export default AppLayout;
