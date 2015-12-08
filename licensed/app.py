#!/usr/bin/python

from flask import Flask
from flask_restful import Api
from api.resources.uses import Use, UseList
from api.resources.policies import Policy, PolicyList
from api.resources.nexus import Nexus, NexusList

app = Flask(__name__)
api = Api(app)

api.add_resource(UseList, '/uses')
api.add_resource(Use, '/uses/<use_id>')
api.add_resource(PolicyList, '/policies')
api.add_resource(Policy, '/policies/<policy_id>')
api.add_resource(NexusList, '/nexus')
api.add_resource(Nexus, '/nexus/<nexus_id>')

# /tickets/[id]

if __name__ == '__main__':
    app.run(debug=True)
