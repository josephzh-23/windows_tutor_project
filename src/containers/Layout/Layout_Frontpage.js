// export default App;
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import '../../App.css'
import { UserContext, UserContextProvider } from '../../Reusable_React/UserContext';
import { getCookie } from '../../Reusable_Vanilla/Utilities/Util';
import Header from '../Header/Header';
import ClientErrorModal from '../Public_chat/clientErrorModal';
import useComponentVisible from '../../Reusable_React/Custom_hook/useComponentVisible';

const Layout_Frontpage = ({children}) => {

  return (
    <div className="front-page">
      {children}
    </div>
  );

}

export default Layout_Frontpage;