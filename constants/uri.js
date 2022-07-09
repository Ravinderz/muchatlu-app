const devBaseUrl = 'http://192.168.0.102:8080';
const prodBaseUrl = 'https://muchatlu-backend.herokuapp.com';
const baseUrl = devBaseUrl;
// const baseUrl = prodBaseUrl;


const URI = {
    authenticate: `${baseUrl}/authenticate`,
    refreshToken: `${baseUrl}/refreshToken`,
    login: `${baseUrl}/login`,
    logout: `${baseUrl}/logoutUser`,
    register: `${baseUrl}/register`,
    getFriends: `${baseUrl}/getAllFriends`,
    getFriendRequests: `${baseUrl}/getFriendRequests`,
    sendFriendRequest: `${baseUrl}/sendFriendRequest`,
    updateFriendRequest: `${baseUrl}/updateFriendRequest`,
    getConversations: `${baseUrl}/getUserConversations`,
    getConversationId: `${baseUrl}/getConversationId`,
    getConversation: `${baseUrl}/getConversation`,
    getConversationV2: `${baseUrl}/getConversationV2`,
    getUserDetails: `${baseUrl}/getUserDetails`,
    getUserPresence: `${baseUrl}/getUserOnlinePresence`,
    updateUserPresence: `${baseUrl}/updateUserPresence`,
    updateUserDetails: `${baseUrl}/updateUserDetails`,
    filterFriends: `${baseUrl}/filterFriends`,
    socketConnect: `${baseUrl}/chat`,
    updateUserPushToken: `${baseUrl}/updateUserPushToken`,
    suggestedTrendingGifTerms: `https://api.tenor.com/v1/trending_terms?key=I57GO2DEOXJN&limit=15`,
    topTrendingGifs: `https://api.tenor.com/v1/trending?key=I57GO2DEOXJN&contentfilter=medium&media_filter=minimal&limit=10`,
    searchGifs: `https://api.tenor.com/v1/search?key=I57GO2DEOXJN&contentfilter=medium&media_filter=minimal&limit=10&q=`,
    searchSuggestionsGIF: `https://api.tenor.com/v1/search_suggestions?key=I57GO2DEOXJN&limit=15&q=`,

}

export default URI;