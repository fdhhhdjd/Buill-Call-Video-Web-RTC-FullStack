import React, { useEffect } from "react";
import { logo } from "../Imports/images";
import {
  ActiveUsersList,
  DashboardDinFormation,
  DirectCall,
  GroupCall,
  GroupCallRoomsList,
} from "../Imports/Index";
import * as webRTCHandler from "../Utils/WebRTCHandler/WebRTCHandler";
import * as webRTCGroupHandler from "../Utils/WebRTCHandler/webRTCGroupCallHandler";

import "../Styles/Dashboard.css";
import { callStates } from "../Utils/ShareData";
import { useSelector } from "react-redux";
const Dashboard = () => {
  const { callState } = useSelector((state) => state.call);
  const { username } = useSelector((state) => state.user);

  useEffect(() => {
    webRTCHandler.getLocalStream();
    webRTCGroupHandler.connectWithMyPeer();
  }, []);
  return (
    <React.Fragment>
      <div className="dashboard_container background_main_color">
        <div className="dashboard_left_section">
          <div className="dashboard_content_container">
            <DirectCall />
            <GroupCall />
            {callState !== callStates.CALL_IN_PROGRESS && (
              <DashboardDinFormation username={username} />
            )}
          </div>
          <div className="dashboard_rooms_container background_secondary_color">
            <GroupCallRoomsList />
          </div>
        </div>
        <div className="dashboard_right_section background_secondary_color">
          <div className="dashboard_active_users_list">
            <ActiveUsersList />
          </div>
          <div className="dashboard_logo_container">
            <img className="dashboard_logo_image" src={logo} alt="logo" />
          </div>
        </div>
        <footer>
          {" "}
          <small>&#9400; Web RTC Tai Heo Dev</small>{" "}
        </footer>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
