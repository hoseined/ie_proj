var mongoose = require('mongoose')
require('../bin/database')

const EssentialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    needed_amount: {
      type: Number,
    },
    metric: {
      type: String,
      validate: {
        validator: function(v) {
          return ["kilogram", "litre", "none"].indexOf(v) !== -1
        }
      }
    }
  }
)

const Essential = mongoose.model('Essential', EssentialSchema)

module.exports = Essential