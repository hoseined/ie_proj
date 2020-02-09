var express = require('express');
var router = express.Router();
var Form = require('../models/Form')
var GeoPolygon = require('../models/GeoPolygon')
var User = require('../models/User')
var Field = require('../models/Field')
var inside_polygon = require('geolocation-utils').insidePolygon
require('../bin/database')

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/forms/create/', async (req, res, next) => {
  var form_title = req.body.title
  var fields = req.body.fields
  var form_fields = []
  for (var field of fields){
    db_field = await Field.create(field)
    form_fields.push(db_field)
  }
  var context = {'title': form_title, 'fields': form_fields, 'is_base_form': true, 
  'location': req.body.location}
  var db_form = await Form.create(context)
  res.send(db_form)
})


router.get('/forms/:polygon_id/', async function(req, res, next) {
  var all_polygons = await GeoPolygon.find({_id: req.params.polygon_id})
  var forms = []
  for (var polygon of all_polygons){
    for (var form_id of polygon.forms){
      var temp = await Form.find({_id: form_id, is_base_form: false})
      temp.area = polygon
      forms.push(temp)
    }
    res.send(forms)
  }
})

router.get('/forms/:polygon_id/', async function(req, res, next) {
  var all_polygons = await GeoPolygon.find({_id: req.params.polygon_id})
  var forms = []
  for (var polygon of all_polygons){
    for (var form_id of polygon.forms){
      var temp = await Form.find({_id: form_id, is_base_form: false})
      temp.area = polygon
      forms.push(temp)
    }
    res.send(forms)
  }
})

router.get('/get_all_forms/:base/', async function(req, res, next) {
  base_form = undefined
  switch (req.params.base){
    case "base": { base_form = true; break;}
    case "submited": {base_form = false; break;}
    default: {res.statusCode = 400; res.send("bad form type"); return;}
  }
  var result = await Form.find({is_base_form: base_form})
  for (var form of result){
    serialized_fields = []
    for (var field_id of form.fields){
      db_field = await Field.findOne({_id: field_id})
      serialized_fields.push(db_field)
    }
    form.fields = serialized_fields
  }
  console.log(result)
  res.send(result)
})


router.get('/get_all_forms/submited/:title/', async function(req, res, next) {
  var result = await Form.find({is_base_form: false, title: req.params.title})
  for (var form of result){
    serialized_fields = []
    for (var field_id of form.fields){
      db_field = await Field.findOne({_id: field_id})
      serialized_fields.push(db_field)
    }
    form.fields = serialized_fields
  }
  if(result.length===0){
    res.statusCode = 404
    res.send("No record found")
  }
  res.send(result)
})

var find_value_of_field = (field_name, data) => {
  for (var field of data){
    if (field.name === field_name){
      return field.value
    }
  }
}



router.post('/submit_form/', async function(req, res, next) {
  var location = req.body.location
  var polygons = await GeoPolygon.find({})
  var base_form = await Form.findOne({is_base_form: true, title: req.body.title})
  var fields = []
  for (var field_id of base_form.fields){
    var field = await Field.findOne({_id: field_id})
    var value = find_value_of_field(field.name, req.body.fields)
    var db_field = await Field.create({'name': field.name,'type':field.type, 'value': value})
    fields.push(db_field._id)
  }
  for (polygon of polygons){
    if (inside_polygon(location, polygon.geometry_coordinates)){
      context = {'title': req.body.title, 'fields': fields, 'is_base_form': false, 'area': polygon.name}
      var db_form = await Form.create(context)
      var updated_polygon = await GeoPolygon.findOne({_id: polygon._id})
      updated_polygon.forms.push(db_form._id)
      await updated_polygon.save()
      res.statusCode = 200
      res.send("Form Created.")
    }
  }
})

router.get('/specific_form/:form_id/', async function(req, res, next) {
  var form = await Form.findOne({_id: req.params.form_id})
  var result = []
  for (var id of form.fields){
    var thing = await Field.findOne({_id: id})
    result.push(thing)
  }
  form.fields = result
  res.send(form)
})

var create_polygon = async (data) => {
  result = await GeoPolygon.create(data)
  return result
}


router.post('/add_polygon/', function(req, res, next) {
  polygon = create_polygon(req.body)
  res.send(polygon)
})

router.post('/register/', (req, res, next) => {
  try {
    console.log({username: req.body.username, email: req.body.email})
    new_user = new User({username: req.body.username, email: req.body.email, is_staff: (req.body.is_staff || false)})
    new_user.setPassword(req.body.password)
    new_user.save()
    res.send(new_user.toAuthJSON())
  }
  catch(err) {
    res.send(err)
  }
})


router.post('/get_auth_token/', async (req, res, next) => {
  user = await User.findOne({username: req.body.username})
  if (user.validate_password(req.body.password)){
    res.send(user.toAuthJSON())
    return
  }
  else {
    res.statusCode=404;
    res.send("user doesnt exist")
  }
})


module.exports = router;
