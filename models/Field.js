var mongoose = require('mongoose')
require('../bin/database')
var mixed = require('mongoose').Mixed

const fieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    value: {
      type: mixed,
    },
    display_type: {
      type: String,
    },
    base_form_type: {
      type: String,
    },
  }
)

const Field = mongoose.model('Field', fieldSchema)

module.exports = Field