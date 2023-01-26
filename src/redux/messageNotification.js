const messageNotification = (messageNotification = [], action) => {
    switch (action.type) {
        case 'NEW_MESSAGE_NOTIFICATION':
            if (messageNotification.find(sender_id => sender_id === action.payload)) return messageNotification;
            return [...messageNotification, action.payload]

        case 'RESET_MESSAGE_NOTIFICATION':
            return []

        case 'REMOVE_MESSAGE_NOTIFICATION':
            return messageNotification.filter(id => id !== action.payload);

        default:
            return messageNotification;
    }
}

export default messageNotification;