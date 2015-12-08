#!/usr/bin/python

from flask_restful import reqparse, abort, Api, Resource, fields, marshal

import uuid

# /tickets/[id]

tickets = { }

# Ticket
# Get, update or delete a single ticket item
class Ticket(Resource):

    def __init__(self):
        self.reqparse = reqparse.RequestParser()
	self.reqparse.add_argument('query', required=True, help="Must supply a query")
	self.reqparse.add_argument('policy', required=True, action='append', help="Must supply a policy")
        super(Ticket, self).__init__()

    def abort_if_ticket_doesnt_exist(self, ticket_id):
	if ticket_id not in tickets:
		abort(404, message="Ticket {} doesn't exist".format(ticket_id))

    def get(self, ticket_id):
        self.abort_if_ticket_doesnt_exist(ticket_id)
        return tickets[ticket_id]

    def delete(self, ticket_id):
        self.abort_if_ticket_doesnt_exist(ticket_id)
        del tickets[ticket_id]
        return '', 204

    def put(self, ticket_id):
        self.abort_if_ticket_doesnt_exist(ticket_id)
        ticket = tickets[ticket_id]
        args = self.reqparse.parse_args()
        for k, v in args.iteritems():
            if v != None:
                ticket[k] = v
        return ticket, 201

# TicketList
# shows a list of all ticket, and lets you POST to add new ticket
class TicketList(Resource):
    def __init__(self):
        super(TicketList, self).__init__()

    def get(self):
        return tickets

    def post(self):
        parser = reqparse.RequestParser()
	parser.add_argument('use', required=True, action='append', help="Must supply a use")
	parser.add_argument('item', required=True, action='append', help="Must supply an item")
        args = parser.parse_args()
	ticket = {}
        for k, v in args.iteritems():
            if v != None:
                ticket[k] = v
	ticket_id = str(uuid.uuid4())
        tickets[ticket_id] = ticket
        return tickets[ticket_id], 201
