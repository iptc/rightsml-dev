#!/usr/bin/python

from flask_restful import reqparse, abort, Api, Resource, fields, marshal

import uuid

# /nexus/[id]

nexus = { }

# Nexus
# Get, update or delete a single nexus item
class Nexus(Resource):

    def __init__(self):
        self.reqparse = reqparse.RequestParser()
	self.reqparse.add_argument('query', required=True, help="Must supply a query")
	self.reqparse.add_argument('policy', required=True, action='append', help="Must supply a policy")
        super(Nexus, self).__init__()

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
        nexus = nexus[nexus_id]
        args = self.reqparse.parse_args()
        for k, v in args.iteritems():
            if v != None:
                nexus[k] = v
        return nexus, 201

# NexusList
# shows a list of all nexus, and lets you POST to add new nexus
class NexusList(Resource):
    def __init__(self):
        super(NexusList, self).__init__()

    def get(self):
        parser = reqparse.RequestParser()
	parser.add_argument('q')
        args = parser.parse_args()
	# @@@TODO - Actually use q to query the nexus and return the ones that match
	# For now, just return the first one if a query parameter is supplied and there is at least one nexus in the nexus dictionary
	if args["q"] and len(nexus) > 0:
		return nexus[nexus.keys()[0]]
        return nexus

    def post(self):
        parser = reqparse.RequestParser()
	parser.add_argument('query', required=True, help="Must supply a query")
	parser.add_argument('policy', required=True, action='append', help="Must supply a policy")
        args = parser.parse_args()
	nexus = {}
        for k, v in args.iteritems():
            if v != None:
                nexus[k] = v
	nexus_id = str(uuid.uuid4())
        nexus[nexus_id] = nexus
        return nexus[nexus_id], 201
