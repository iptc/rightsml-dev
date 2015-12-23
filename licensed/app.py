#!/usr/bin/python

from flask import Flask
from flask_restful import Resource, Api
from api.resources.uses import Use, UseList
from api.resources.policies import Policy, PolicyList
from api.resources.nexus import Nexus, NexusList
from api.resources.mockecr import MockECR, MockECRList
from api.resources.tickets import Ticket, TicketList
from api.resources.fm import Fm, FmList

app = Flask(__name__)
api = Api(app)

api.add_resource(UseList, '/uses', resource_class_kwargs = {'api' : api})
api.add_resource(Use, '/uses/<use_id>', resource_class_kwargs = {'api' : api})
api.add_resource(PolicyList, '/policies', resource_class_kwargs = {'api' : api})
api.add_resource(Policy, '/policies/<policy_id>', resource_class_kwargs = {'api' : api})
api.add_resource(NexusList, '/nexus', resource_class_kwargs = {'api' : api})
api.add_resource(Nexus, '/nexus/<nexus_id>', resource_class_kwargs = {'api' : api})
api.add_resource(MockECRList, '/mockecr')
api.add_resource(MockECR, '/mockecr/<ecr_id>')
api.add_resource(TicketList, '/tickets', resource_class_kwargs = {'api' : api})
api.add_resource(Ticket, '/tickets/<ticket_id>', resource_class_kwargs = {'api' : api})
api.add_resource(FmList, '/fms', resource_class_kwargs = {'api' : api})
api.add_resource(Fm, '/fms/<fm_id>', resource_class_kwargs = {'api' : api})

if __name__ == '__main__':
    app.run(debug=True)
