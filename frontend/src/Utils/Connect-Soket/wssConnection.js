import socketClient from "socket.io-client";
import { setActiveUserInitiate } from "../../Redux/Action/ActionMain";
import store from "../../Redux/Store";
import * as webRTCHandler from "../WebRTCHandler/WebRTCHandler";
import { broadcastEventTypes } from "../../Utils/ShareData";
const SERVER = "http://localhost:5001";

let socket;

export const connectWithWebSocket = () => {
  socket = socketClient(SERVER);

  socket.on("connection", () => {
    console.log("succesfully connected with wss server");
    console.log(socket.id);
  });

  socket.on("broadcast", (data) => {
    handleBroadcastEvents(data);
  });

  // listeners related with direct call
  socket.on("pre-offer", (data) => {
    webRTCHandler.handlePreOffer(data);
  });

  socket.on("pre-offer-answer", (data) => {
    webRTCHandler.handlePreOfferAnswer(data);
  });

  socket.on("webRTC-offer", (data) => {
    webRTCHandler.handleOffer(data);
  });

  socket.on("webRTC-answer", (data) => {
    webRTCHandler.handleAnswer(data);
  });

  socket.on("webRTC-candidate", (data) => {
    webRTCHandler.handleCandidate(data);
  });

  socket.on("user-hanged-up", () => {
    webRTCHandler.handleUserHangedUp();
  });

  // listeners related with group calls

  // socket.on("group-call-join-request", (data) => {
  //   webRTCGroupCallHandler.connectToNewUser(data);
  // });

  // socket.on("group-call-user-left", (data) => {
  //   webRTCGroupCallHandler.removeInactiveStream(data);
  // });
};

export const registerNewUser = (username) => {
  socket.emit("register-new-user", {
    username: username,
    socketId: socket.id,
  });
};

// emitting events to server related with direct call

export const sendPreOffer = (data) => {
  console.log(data, "----dasdasdd----");
  socket.emit("pre-offer", data);
};

export const sendPreOfferAnswer = (data) => {
  socket.emit("pre-offer-answer", data);
};

export const sendWebRTCOffer = (data) => {
  socket.emit("webRTC-offer", data);
};

export const sendWebRTCAnswer = (data) => {
  socket.emit("webRTC-answer", data);
};

export const sendWebRTCCandidate = (data) => {
  socket.emit("webRTC-candidate", data);
};

export const sendUserHangedUp = (data) => {
  socket.emit("user-hanged-up", data);
};

const handleBroadcastEvents = (data) => {
  switch (data.event) {
    case broadcastEventTypes.ACTIVE_USERS:
      const activeUsers = data.activeUsers.filter(
        (activeUser) => activeUser.socketId !== socket.id
      );
      store.dispatch(setActiveUserInitiate(activeUsers));

      break;
    // case broadcastEventTypes.GROUP_CALL_ROOMS:
    //   const groupCallRooms = data.groupCallRooms.filter(
    //     (room) => room.socketId !== socket.id
    //   );
    //   const activeGroupCallRoomId =
    //     webRTCGroupCallHandler.checkActiveGroupCall();

    //   if (activeGroupCallRoomId) {
    //     const room = groupCallRooms.find(
    //       (room) => room.roomId === activeGroupCallRoomId
    //     );
    //     if (!room) {
    //       webRTCGroupCallHandler.clearGroupData();
    //     }
    //   }
    //   store.dispatch(dashboardActions.setGroupCalls(groupCallRooms));
    //   break;
    default:
      break;
  }
};