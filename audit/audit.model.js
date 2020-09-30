const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  user :{ type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"},
    timestamp: { type: Date, default: Date.now },
    clientIp: { type: String, required: true },
    type:{ type: String, required: true }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('AuditCollection', schema);