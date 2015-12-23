#!/usr/bin/python

from flask_restful import reqparse, abort, Api, Resource, fields, request
from marshmallow import Schema, fields

import uuid

import string

import requests

# /tickets/[id]
# You create a ticket by supplying a desired use and a desired asset
# The tickets API checks what policies match the asset - by querying the /nexus API
# If the matching policies allow the required use then you get a new ticket that permits the use with a 201 Created
# If the matching policies do not allow the use then you get a new ticket that denies the use with a 403 Forbidden
# If the matching policies allow the use but have some duties then you get a new ticket that permits the use, lists the duties with a 402 Payment Required
# The duties may not involve payment, but 402 seems the closest result code to me.
# And it is important to distinguish the "green light" (201) and "red light" (403) cases from the "yellow light" (402) cases

tickets = { }

class TicketsSchema(Schema):
        id = fields.Str()
        self = fields.Str()
        use = fields.Str()
        asset = fields.Str()

# Ticket
# Get, update or delete a single ticket item
class Ticket(Resource):
    def __init__(self, **kwargs):
	self.ts = TicketsSchema()
	self.api = kwargs['api']

    def abort_if_tickets_doesnt_exist(self, ticket_id):
	if ticket_id not in tickets:
		abort(404, message="Tickets {} doesn't exist".format(ticket_id))

    def get(self, ticket_id):
        self.abort_if_tickets_doesnt_exist(ticket_id)
        return tickets[ticket_id]

    def delete(self, ticket_id):
        self.abort_if_tickets_doesnt_exist(ticket_id)
        del tickets[ticket_id]
        return '', 204

    def put(self, ticket_id):
        self.abort_if_tickets_doesnt_exist(ticket_id)
	json_data = request.get_json()
	if not json_data:
		return jsonify({'message': 'No input data provided'}), 400
        data,errors = self.ts.load(json_data)
        tickets[ticket_id] = data
        tickets[ticket_id]["id"] = ticket_id
        tickets[ticket_id]["self"] = self.api.url_for(Ticket, ticket_id = ticket_id, _external=True)
        return tickets[ticket_id], 201

# TicketList
# shows a list of all tickets, and lets you POST to add new tickets
class TicketList(Resource):
    def __init__(self, **kwargs):
	self.ts = TicketsSchema()
	self.api = kwargs['api']

    def get(self):
        return tickets.values()

    def post(self):
	json_data = request.get_json()
	if not json_data:
		return jsonify({'message': 'No input data provided'}), 400
        data,errors = self.ts.load(json_data)
	ticket_id = str(uuid.uuid4())
        tickets[ticket_id] = data
        tickets[ticket_id]["id"] = ticket_id
        tickets[ticket_id]["self"] = self.api.url_for(Ticket, ticket_id = ticket_id, _external=True)
	return tickets[ticket_id], 201
