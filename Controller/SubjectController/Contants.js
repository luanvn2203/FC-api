module.exports = {
    responseStatus: {
        SUCCESS: 'Success',
        FAILED: 'Failed'
    },
    responseMessage: {

        CREATE_SUBJECT_SUCCESS: 'Create subject successfully',
        CREATE_SUBJECT_FAILED: 'Create subject failed',
        DUPLICATE_SUBJECT_NAME_CREATED_BY_USER: 'Duplicate subject name, you have create name of subject before',

        GET_SUBJECT_FAILED_BY_LIST_TOPIC_ID_WITH_NOT_FOUND_TOPIC_ID: 'Not found subject for this list of topic id',
        GET_SUBJECT_FAILED_BY_TOPIC_ID: 'Not found subject in the topic',
        GET_SUBJECT_FAILED_FOR_INTEREST_HOME_WITH_NOT_FOUND_TOPIC_ID: 'Not found topic ID',


        UPDATE_SUBJECT_SUCCESS: 'Update subject successfully',
        UPDATE_SUBJECT_FAILED: 'Update subject failed',

        updateSubjectStatus_SUCCESS: function (status) {
            return `Update to ${status} success`
        },
        UPDATE_SUBJECT_STATUS_FAILED_WITH_NO_PERMISSION: 'Update status failed, you do not have permission to update this subject',
        UPDATE_SUBJECT_STATUS_FAILED_WITH_WRONG_STATUS: 'Cannot update to this status',

        DELETE_SUBJECT_BY_AUTHOR_SUCCESS: 'Delete subject successfully',
        DELETE_SUBJECT_BY_AUTHOR_FAILED_WITH_NO_PERMISSION: 'Delete failed, you dont has permission to delete this subject',
        DELETE_SUBJECT_BY_AUTHOR_FAILED_WITH_SUBJECT_IN_USE: 'Subject is learning by someone, cannot delete right now'
    }

}