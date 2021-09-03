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
    initialRate: 0.5,
    middleRate: 1,
    maxRate: 1.5,
    one_level_rate: 0.1
}
const JoinTimesToIncreaseRateLevel = 30

module.exports = {
    point_minus,
    point_add,
    point_define,
    JoinTimesToIncreaseRateLevel,
    PointRate
}
