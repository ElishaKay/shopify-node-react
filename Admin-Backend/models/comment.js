const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema(
    {
        postSlug: {
            type: String,
            index: true
        },
        body: {
            type: Array,
            required: true,
            min: 200,
            max: 2000000
        },
        coverMedia: {
            type: String
        },
        html: {
            type: String
        },
        excerpt: {
            type: String,
            max: 1000
        },
        hidden: { 
            type: Boolean, 
            default: true 
        },
        postedBy: {
            type: ObjectId,
            ref: 'User'
        },
        shopPostedAt: { 
            type: ObjectId, 
            ref: 'Shop'
        },
        shopifyDomain: { 
            type: String
        },
        archivedByUser: {
            type: Boolean,
            default: false
        },
        userNotified: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
