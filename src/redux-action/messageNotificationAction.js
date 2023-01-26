const newMessageNotificationAction = (sender_id) => {
    return {
        type: 'NEW_MESSAGE_NOTIFICATION',
        payload: sender_id
    }
}

const resetMessageNotificationAction = () => {
    return {
        type: "RESET_MESSAGE_NOTIFICATION"
    }
}

const removeMessageNotificationAction = (id) => {
    return {
        type: "REMOVE_MESSAGE_NOTIFICATION",
        payload: id
    }
}

export { newMessageNotificationAction, resetMessageNotificationAction, removeMessageNotificationAction }