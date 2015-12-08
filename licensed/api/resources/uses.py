#!/usr/bin/python

from flask_restful import reqparse, abort, Api, Resource, fields, marshal, request
import json
import uuid

# /uses/[id]

uses = { }

constraint_fields = {
			"name" : fields.String,
			"operator" : fields.String,
			"rightoperand" : fields.String
}

use_fields = {
	"id" : fields.String,
	"title" : fields.String,
	"description" : fields.String,
	"action" : fields.String,
	"constraints" : fields.List(fields.Nested(constraint_fields))
}

# Use
# shows a single use item and lets you delete a use item
class Use(Resource):
    def abort_if_use_doesnt_exist(self, use_id):
	if use_id not in uses:
		abort(404, message="Use {} doesn't exist".format(use_id))

    def get(self, use_id):
        self.abort_if_use_doesnt_exist(use_id)
        return marshal(uses[use_id], use_fields)

    def delete(self, use_id):
        self.abort_if_use_doesnt_exist(use_id)
        del uses[use_id]
        return '', 204

    def put(self, use_id):
        self.abort_if_use_doesnt_exist(use_id)
	json_data = request.get_json()
	if not json_data:
		return jsonify({'message': 'No input data provided'}), 400
        uses[use_id] = json_data
        uses[use_id]["id"] = use_id # Just to make sure
        return marshal(uses[use_id], use_fields), 201

# UseList
# shows a list of all uses, and lets you POST to add new uses
class UseList(Resource):
    def get(self):
	return {'uses': [marshal(use, use_fields) for use in uses]}

    def post(self):
	json_data = request.get_json()
	if not json_data:
		return jsonify({'message': 'No input data provided'}), 400
	use_id = str(uuid.uuid4())
        uses[use_id] = json_data
        uses[use_id]["id"] = use_id
        return marshal(uses[use_id], use_fields), 201
