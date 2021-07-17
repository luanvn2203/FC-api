module.exports = {
    responseStatus: {
        SUCCESS: 'Success',
        FAILED: 'Failed'
    },
    responseMessage: {
        // get success
        GET_TOPIC_SUCCESS: 'Get toptic successfully',
        //get failed
        GET_TOPIC_BY_ID_FAILED_WITH_NO_RECORD: "Not Found topic with this id",
        SEARCH_TOPICS_BY_NAME_FAILED_WITH_NO_RECORD: "Not found topic with this name",
        SEARCH_TOPICS_BY_EMAIL_FAILED_WITH_NO_RECORD: "Not found topic with this email",
        //create success
        CREATE_TOPIC_SUCCESS: 'Create topic successfully',
        //create failed
        CREATE_TOPIC_FAILED: 'Create topic failed',
        //delete topic success
        DELETE_TOPIC_SUCCESS: 'Delete topic successfully',
        //delete failed
        DELETE_TOPIC_FAILED_WITH_NO_PERMISSION: 'Delete failed, you dont have permission to delete this topic',

        //change topic status ok
        updateTopicStatusSuccess: function (statusName) {
            return `Update to ${statusName} success`
        },

        UPDATE_TOPIC_STATUS_FAILED_WITH_NO_PERMISSION: 'Update status failed, you do not have permission to update this topic',
        UPDATE_TOPIC_STATUS_FAILED_WITH_WRONG_STATUS: 'Cannot update to this status',
        UPDATE_TOPIC_SUCCESS: "Update topic successfully",
        UPDATE_TOPIC_FAILED: "Update topic failed",
        UPDATE_TOPIC_FAILED_WITH_NO_PERMISSION: "You don't have permission to update this topic"
    }

}