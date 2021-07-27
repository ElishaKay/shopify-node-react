const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            max: 160
        },
        slug: {
            type: String
        },
        body: {
            type: Array,
            required: true
        },
        html: {
            type: String
        },
        excerpt: {
            type: String,
            max: 1000
        },
        mtitle: {
            type: String
        },
        mdesc: {
            type: String
        },
        coverMedia: {
            type: String
        },
        hidden: { 
            type: Boolean, 
            default: true 
        },
        comments: [{ 
            type: ObjectId, 
            ref: 'Comment'
        }],
        selectedProducts: {
            type: [Array]
        },
        relatedProducts: [{ 
            type: ObjectId, 
            ref: 'Product'
        }],
        categories: [{ 
            type: ObjectId, 
            ref: 'Category'
        }],
        tags: [{ 
            type: ObjectId, 
            ref: 'Tag'
        }],
        emojis: [{ 
            type: ObjectId, 
            ref: 'Emoji'
        }],
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

blogSchema.index({ slug: 1, shopifyDomain: 1}, { unique: true });

blogSchema.methods = {
    setDefaultUpgrades: function() {
        var self = this;
        WarehouseUpgrade.find({ level: 0 }).exec(function (err, collection) {
            for (var i = 0; i < collection.length; i++) {
                var upgrade = collection[i];
                self[upgrade.type] = upgrade._id;
            }
            self.save();
        });
    }
};

module.exports = mongoose.model('Blog', blogSchema);
