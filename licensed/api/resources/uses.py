#!/usr/bin/python

from flask_restful import reqparse, abort, Api, Resource, request
from marshmallow import Schema, fields
import json
import uuid

# /uses/[id]

uses = { }

class ConstraintsSchema(Schema):
	name = fields.Str()
	operator = fields.Str()
	rightoperand = fields.Str()

class UseSchema(Schema):
	id = fields.Str()
	self = fields.Str()
	title = fields.Str()
	description = fields.Str()
	action = fields.Str()
	constraints = fields.Nested(ConstraintsSchema, many=True)

# Use
# shows a single use item and lets you delete a use item
class Use(Resource):
    def __init__(self, **kwargs):
	self.us = UseSchema()
	self.api = kwargs['api']

    def abort_if_use_doesnt_exist(self, use_id):
	if use_id not in uses:
		abort(404, message="Use {} doesn't exist".format(use_id))

    def get(self, use_id):
        self.abort_if_use_doesnt_exist(use_id)
        return uses[use_id]

    def delete(self, use_id):
        self.abort_if_use_doesnt_exist(use_id)
        del uses[use_id]
        return '', 204

    def put(self, use_id):
        self.abort_if_use_doesnt_exist(use_id)
	json_data = request.get_json()
	if not json_data:
		return jsonify({'message': 'No input data provided'}), 400
        data,errors = self.us.load(json_data)
        uses[use_id] = data
        uses[use_id]["id"] = use_id # Just to make sure
        uses[use_id]["self"] = self.api.url_for(Use, use_id = use_id, _external=True)
        return uses[use_id], 201

# UseList
# shows a list of all uses, and lets you POST to add new uses
class UseList(Resource):
    def __init__(self, **kwargs):
	self.us = UseSchema()
	self.api = kwargs['api']

    def get(self):
	return {'uses': [self.us.dumps(use) for use in uses]}

    def post(self):
	json_data = request.get_json()
	if not json_data:
		return jsonify({'message': 'No input data provided'}), 400
	use_id = str(uuid.uuid4())
        data,errors = self.us.load(json_data)
        uses[use_id] = data
        uses[use_id]["id"] = use_id
        uses[use_id]["self"] = self.api.url_for(Use, use_id = use_id, _external=True)
        return uses[use_id], 201
