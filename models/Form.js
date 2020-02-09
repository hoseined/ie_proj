var mongoose = require('mongoose')
require('../bin/database')

const formSchema = new mongoose.Schema(
  {
    title: {
      type: String
    },
    fields: [{type : mongoose.Schema.ObjectId, ref : 'Field'}],
    is_base_form: {
      type: Boolean,
    },
    location: {
      type: [mongoose.Decimal128, mongoose.Decimal128],
    },
    area: { type: String },
  }
)

const Form = mongoose.model('Form', formSchema)

module.exports = Form