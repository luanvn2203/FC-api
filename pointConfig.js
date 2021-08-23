const point_minus = {
    subject_request_point_minus: 10,
    lession_request_point_minus: 7,

    public_relation_point_subject: 3
}
const point_add = {
    author_approved_subject: 3,
    author_approved_lession: 1
}

const point_define = {
    private_lesson: 100,
    public_lesson: 50
}

const PointRate = {
    minRate: 0.8, // 0.1 - 0.6
    mediumRate: 0.9, //0.6- 0.8
    maxRate: 1 // 0.8 - 1
}

module.exports = {
    point_minus,
    point_add,
    point_define
}