/**
 * Global store for the context Api
 * instance of third library "from-react-context"
 * @see https://github.com/adelpheRaime/from-react-context
 */
const store = {
  User: {},
  ReceivedBy: {},
  Inbox: [],
  FlashError:{
    status: false,
    message: ""
  },
  Messages:[],
  FileProgress:false,
  isInboxUpdated: false,
  OnlineUsers: [],
  Profile: "",
  IsDialogOpen:false,
  isEditProfile: false,
  isFileUpload: false,
  isConfirm: false,
};
export default store;
