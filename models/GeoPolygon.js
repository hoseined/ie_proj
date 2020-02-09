var mongoose = require('mongoose')
require('../bin/database')
var insidePolygon = require('geolocation-utils').insidePolygon
var Decimal = mongoose.Schema.Types.Decimal128;

const GeoPolygonSchema = new mongoose.Schema(
  {
    name : {
      type: String,
      unique: true,
    },
    geometry_type : {
      type: String
    },
    geometry_coordinates : Array,
    forms : [ {type : mongoose.Schema.ObjectId, ref : 'Form'} ],
  }
)

GeoPolygonSchema.statics.is_inside = function(point, polygon){
  return insidePolygon(point, standardise_coordinates(polygon))
}

const Polygon = mongoose.model('Polygon', GeoPolygonSchema)

module.exports = Polygon