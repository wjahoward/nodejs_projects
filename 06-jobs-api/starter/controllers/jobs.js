const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');

const getAllJobs = async (req, res) => { // looks for jobs associated to the user
    const jobs = await Job.find({createdBy: req.user.userId})
                        .sort('createdAt');
    return res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
    // console.log(req.params);
    // const {user: {userId}, params: {id: jobId}} = req;
    const jobId = req.params.id;
    const userId = req.user.userId;
    
    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId
    });

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
    }

    return res.status(StatusCodes.OK).json(job);
};

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    return res.status(StatusCodes.CREATED).json(job);
};

const updateJob = async (req, res) => {
    res.send('update job');
};

const deleteJob = async (req, res) => {
    res.send('delete job');
};

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
};