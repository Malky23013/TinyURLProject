// const mongoose = require('mongoose');

// const clickSchema = new mongoose.Schema({
//     insertedAt: { type: Date, default: Date.now },
//     ipAddress: String,
//     targetParamValue: String
// });

// const linkSchema = new mongoose.Schema({
//     originalUrl: String,
//     clicks: [clickSchema],
//     targetParamName: { type: String, default: 't' },
//     targetValues: [{
//         name: String,
//         value: String
//     }]
// });

// const Link = mongoose.model('Link', linkSchema);

// module.exports = Link;
// export default Link;
import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  insertedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  },
  targetParamValue: String
});

const targetValueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

const linkSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  clicks: [clickSchema],
  targetParamName: {
    type: String,
    default: 't'
  },
  targetValues: [targetValueSchema]
});


const Link = mongoose.model('Link', linkSchema);

export default Link;