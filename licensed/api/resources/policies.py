#!/usr/bin/python

from flask_restful import reqparse, abort, Api, Resource, request
from marshmallow import Schema, fields
import json
import uuid

# /policies/[id]

policies = {}

class ConstraintSchema(Schema):
	name = fields.Str()
	operator = fields.Str()
	rightoperand = fields.Str()

class ProhibDutySchema(Schema):
	assigner = fields.Str()
	assignee = fields.Str()
	assignee_scope = fields.Str()
	target = fields.Str()
	output = fields.Str()
	action = fields.Str()
        constraints = fields.Nested(ConstraintSchema, many=True)

class PermissionSchema(Schema):
        target = fields.Str()
        action = fields.Str()
        assignee = fields.Str()
        constraints = fields.Nested(ConstraintSchema, many=True)
        duties = fields.Nested(ProhibDutySchema, many=True)

class PolicySchema(Schema):
        id = fields.Str()
        policyid = fields.Str()
        policytype = fields.Str()
        policyprofile = fields.Str()
        permissions = fields.Nested(PermissionSchema, many=True)
        prohibitions = fields.Nested(ProhibDutySchema, many=True)

# Policy
# shows a single policy item and lets you delete a policy item
class Policy(Resource):
    def __init__(self, **kwargs):
	self.ps = PolicySchema()
	self.api = kwargs['api']

    def abort_if_policy_doesnt_exist(self, policy_id):
	if policy_id not in policies:
		abort(404, message="Policy {} doesn't exist".format(policy_id))

    def get(self, policy_id):
        self.abort_if_policy_doesnt_exist(policy_id)
        return policies[policy_id]

    def delete(self, policy_id):
        self.abort_if_policy_doesnt_exist(policy_id)
        del policies[policy_id]
        return '', 204

    def put(self, policy_id):
        self.abort_if_policy_doesnt_exist(policy_id)
	json_data = request.get_json()
	if not json_data:
		return jsonify({'message': 'No input data provided'}), 400
        data,errors = self.ps.load(json_data)
        policies[policy_id] = data
        policies[policy_id]["id"] = policy_id
        policies[policy_id]["policyid"] = self.api.url_for(Policy, policy_id = policy_id, _external=True)
	return policies[policy_id], 201

# PolicyList
# shows a list of all policies, and lets you POST to add new policies
class PolicyList(Resource):
    def __init__(self, **kwargs):
	self.ps = PolicySchema()
	self.api = kwargs['api']

    def get(self):
	return {'policies': [self.ps.dumps(policy) for policy in policies]}

    def post(self):
	json_data = request.get_json()
	if not json_data:
		return jsonify({'message': 'No input data provided'}), 400
	policy_id = str(uuid.uuid4())
        data,errors = self.ps.load(json_data)
        policies[policy_id] = data
        policies[policy_id]["id"] = policy_id
        policies[policy_id]["policyid"] = self.api.url_for(Policy, policy_id = policy_id, _external=True)
        return policies[policy_id], 201
