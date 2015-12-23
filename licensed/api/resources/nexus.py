#!/usr/bin/python

from flask_restful import reqparse, abort, Api, Resource, fields, request
from marshmallow import Schema, fields

import uuid

import string

import dpath.util
import fnmatch

import requests

# /nexus/[id]

nexus = { }

class NexusSchema(Schema):
        id = fields.Str()
        self = fields.Str()
        query = fields.Str()
        policy = fields.Str()

class NinjsSchema(Schema):
        id = fields.Str()
        uri = fields.Str()
        type = fields.Str()
        versioncreated = fields.Str()
        byline = fields.Str()
        headline = fields.Str()
        body_text = fields.Str()
        body_xhtml = fields.Str()

# Nexus
# Get, update or delete a single nexus item
class Nexus(Resource):
    def __init__(self, **kwargs):
	self.ns = NexusSchema()
	self.api = kwargs['api']

    def abort_if_nexus_doesnt_exist(self, nexus_id):
	if nexus_id not in nexus:
		abort(404, message="Nexus {} doesn't exist".format(nexus_id))

    def get(self, nexus_id):
        self.abort_if_nexus_doesnt_exist(nexus_id)
        return nexus[nexus_id]

    def delete(self, nexus_id):
        self.abort_if_nexus_doesnt_exist(nexus_id)
        del nexus[nexus_id]
        return '', 204

    def put(self, nexus_id):
        self.abort_if_nexus_doesnt_exist(nexus_id)
	json_data = request.get_json()
	if not json_data:
		return jsonify({'message': 'No input data provided'}), 400
        data,errors = self.ns.load(json_data)
        nexus[nexus_id] = data
        nexus[nexus_id]["id"] = nexus_id
        nexus[nexus_id]["self"] = self.api.url_for(Nexus, nexus_id = nexus_id, _external=True)
        return nexus[nexus_id], 201

# NexusList
# shows a list of all nexus, and lets you POST to add new nexus
class NexusList(Resource):
    def __init__(self, **kwargs):
	self.ns = NexusSchema()
	self.api = kwargs['api']
	self.ninjss = NinjsSchema()

    def _fetch(self, ninjsuri):
        data,errors = self.ninjss.loads('{ "uri" : "http://ninjs.example.com/newsitems/20130709simp123", "type" : "text", "versioncreated" : "2013-07-09T10:37:00Z", "byline" : "Paulo Santalucia and Frances dEmilio", "headline" : "Captain of wrecked cruise ship on trial in Italy", "body_text" : "GROSSETO, Italy (AP) -- The trial of the captain of the shipwrecked Costa Concordia cruise liner has begun in a theater converted into a courtroom in Tuscany to accommodate all the survivors and relatives of the 32 victims who want to see justice carried out in the 2012 tragedy. The sole defendant, Francesco Schettino, his eyes shaded by sunglasses and slipping into a back door, made no comment to reporters as he arrived for his trial Tuesday on charges of multiple manslaughter, abandoning ship and causing the shipwreck near the island of Giglio. His lawyer, Domenico Pepe, told reporters that, as expected, the judge was postponing the hearing due to an eight-day nationwide lawyers strike. Pepe said some 1,000 witnesses are expected to eventually testify. Many of them are expected to be from among the 4,2000 passengers and crew aboard the ship that struck a jagged reef off Giglio, took on water and capsized. Schettino has denied wrongdoing.", "body_xhtml" : "<p>GROSSETO, Italy (AP) -- The trial of the captain of the shipwrecked Costa Concordia cruise liner has begun in a theater converted into a courtroom in Tuscany to accommodate all the survivors and relatives of the 32 victims who want to see justice carried out in the 2012 tragedy.</p><p>The sole defendant, Francesco Schettino, his eyes shaded by sunglasses and slipping into a back door, made no comment to reporters as he arrived for his trial Tuesday on charges of multiple manslaughter, abandoning ship and causing the shipwreck near the island of Giglio.</p><p>His lawyer, Domenico Pepe, told reporters that, as expected, the judge was postponing the hearing due to an eight-day nationwide lawyers strike.</p><p>Pepe said some 1,000 witnesses are expected to eventually testify. Many of them are expected to be from among the 4,2000 passengers and crew aboard the ship that struck a jagged reef off Giglio, took on water and capsized. Schettino has denied wrongdoing.</p>" }')
        return data

    def _match(self, ninjsuri, query):
	querylist = string.split(query, "=")
	path = querylist[0]
	pattern = querylist[1]
	ninjs = self._fetch(ninjsuri)
	return dpath.util.values(ninjs, path, afilter=(lambda x : fnmatch.fnmatch(x, pattern))) != []

    def get(self):
        parser = reqparse.RequestParser()
	parser.add_argument('q')
        args = parser.parse_args()
	if args["q"] and len(nexus) > 0:
		return [n for n in nexus.values() if self._match(args["q"], n["query"])]
        return nexus.values()

    def post(self):
	json_data = request.get_json()
	if not json_data:
		return jsonify({'message': 'No input data provided'}), 400
        data,errors = self.ns.load(json_data)
	nexus_id = str(uuid.uuid4())
        nexus[nexus_id] = data
        nexus[nexus_id]["id"] = nexus_id
        nexus[nexus_id]["self"] = self.api.url_for(Nexus, nexus_id = nexus_id, _external=True)
        return nexus[nexus_id], 201
