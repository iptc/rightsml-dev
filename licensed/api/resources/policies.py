#!/usr/bin/python

from flask_restful import reqparse, abort, Api, Resource, fields, marshal, request
import json
import uuid

# /policies/[id]

policies = { }

constraint_fields = {
			"name" : fields.String,
			"operator" : fields.String,
			"rightoperand" : fields.String
}

permission_fields = {
	"target" : fields.String,
	"action" : fields.String
}

prohibduty_fields = {
	"assigner" : fields.String,
	"assignee" : fields.String,
	"assignee_scope" : fields.String,
	"target" : fields.String,
	"output" : fields.String,
	"action" : fields.String,
	"constraints" : fields.List(fields.Nested(constraint_fields))
}


policy_fields = {
	"id" : fields.String,
	"policyid" : fields.String,
	"policytype" : fields.String,
	"permissions" : fields.List(fields.Nested(permission_fields))
}

# Policy
# shows a single policy item and lets you delete a policy item
class Policy(Resource):

    def abort_if_policy_doesnt_exist(self, policy_id):
	if policy_id not in policies:
		abort(404, message="Policy {} doesn't exist".format(policy_id))

    def get(self, policy_id):
        self.abort_if_policy_doesnt_exist(policy_id)
        return marshal(policies[policy_id], policy_fields)

    def delete(self, policy_id):
        self.abort_if_policy_doesnt_exist(policy_id)
        del policies[policy_id]
        return '', 204

    def put(self, policy_id):
        self.abort_if_policy_doesnt_exist(policy_id)
	json_data = request.get_json()
	if not json_data:
		return jsonify({'message': 'No input data provided'}), 400
        policies[policy_id] = json_data
        policies[policy_id]["id"] = policy_id
        policies[policy_id]["policy_id"] = policy_id
        return marshal(policies[policy_id], policy_fields), 201

# PolicyList
# shows a list of all policies, and lets you POST to add new policies
class PolicyList(Resource):

    def get(self):
	return {'policies': [marshal(policy, policy_fields) for policy in policies]}

    def post(self):
	json_data = request.get_json()
	if not json_data:
		return jsonify({'message': 'No input data provided'}), 400
	policy_id = str(uuid.uuid4())
        policies[policy_id] = json_data
        policies[policy_id]["id"] = policy_id
        policies[policy_id]["policy_id"] = policy_id
        return marshal(policies[policy_id], policy_fields), 201
