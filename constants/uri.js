const devBaseUrl =  'http://192.168.0.103:8080';
const prodBaseUrl =  'http://muchatlu-backend.herokuapp.com';
const baseUrl = devBaseUrl;
// const baseUrl = prodBaseUrl;


const URI = {
    authenticate:`${baseUrl}/authenticate`,
    login:`${baseUrl}/login`,
    logout:`${baseUrl}/logoutUser`,
    register:`${baseUrl}/register`,
    getFriends:`${baseUrl}/getAllFriends`,
    getFriendRequests:`${baseUrl}/getFriendRequests`,
    sendFriendRequest:`${baseUrl}/sendFriendRequest`,
    updateFriendRequest:`${baseUrl}/updateFriendRequest`,
    getConversations:`${baseUrl}/getUserConversations`,
    getConversationId:`${baseUrl}/getConversationId`,
    getConversation:`${baseUrl}/getConversation`,
    getUserDetails:`${baseUrl}/getUserDetails`,
    getUserPresence:`${baseUrl}/getUserOnlinePresence`,
    updateUserDetails:`${baseUrl}/updateUserDetails`,
    socketConnect:`${baseUrl}/chat`

}

export default URI;