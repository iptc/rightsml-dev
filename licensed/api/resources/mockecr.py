#!/usr/bin/python

from flask_restful import reqparse, abort, Api, Resource, fields, request
from marshmallow import Schema, fields

import uuid

# /mockecr/[id]

mockecr = { }

class MockECRSchema(Schema):
        id = fields.Str()
        uri = fields.Str()
        type = fields.Str()
        versioncreated = fields.Str()
        byline = fields.Str()
        headline = fields.Str()
        body_text = fields.Str()
        body_xhtml = fields.Str()

# MockECR
# Get, update or delete a single mockecr item
class MockECR(Resource):
    def __init__(self):
	self.ns = MockECRSchema()

    def abort_if_mockecr_doesnt_exist(self, mockecr_id):
	if mockecr_id not in mockecr:
		abort(404, message="MockECR {} doesn't exist".format(mockecr_id))

    def get(self, mockecr_id):
        self.abort_if_mockecr_doesnt_exist(mockecr_id)
        return mockecr[mockecr_id]

    def delete(self, mockecr_id):
        self.abort_if_mockecr_doesnt_exist(mockecr_id)
        del mockecr[mockecr_id]
        return '', 204

    def put(self, mockecr_id):
        self.abort_if_mockecr_doesnt_exist(mockecr_id)
	json_data = request.get_json()
	if not json_data:
		return jsonify({'message': 'No input data provided'}), 400
        data,errors = self.ns.load(json_data)
        mockecr[mockecr_id] = data
        mockecr[mockecr_id]["id"] = mockecr_id
        return mockecr[mockecr_id], 201

# MockECRList
# shows a list of all mockecr, and lets you POST to add new mockecr
class MockECRList(Resource):
    def __init__(self):
	self.ns = MockECRSchema()

    def get(self):
        parser = reqparse.RequestParser()
	parser.add_argument('q')
        args = parser.parse_args()
	# @@@TODO - Actually use q to query the mockecr and return the ones that match
	# For now, just return the first one if a query parameter is supplied and there is at least one mockecr in the mockecr dictionary
	if args["q"] and len(mockecr) > 0:
		return mockecr[mockecr.keys()[0]]
        return mockecr

    def post(self):
	json_data = request.get_json()
	if not json_data:
		return jsonify({'message': 'No input data provided'}), 400
        data,errors = self.ns.load(json_data)
	mockecr_id = str(uuid.uuid4())
        mockecr[mockecr_id] = data
        mockecr[mockecr_id]["id"] = mockecr_id
        return mockecr[mockecr_id], 201
