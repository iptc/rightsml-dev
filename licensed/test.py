from flask_restful import fields, marshal
import json

constraints_fields = {
    'name': fields.String,
    'operator': fields.String,
    'rightoperand': fields.String
}

use_fields = {
    'action': fields.String,
    'constraints': fields.List(fields.Nested(constraints_fields))
}

data = '{"action": "http://www.w3.org/ns/odrl/2/distribute", "constraints": [ { "name": "http://www.w3.org/ns/odrl/2/spatial", "operator": "http://w3.org/ns/odrl/2/vocab/eq", "rightoperand": "http://cvx.iptc.org/iso3166-1a3/DEU" } ]}'

#print(json.dumps(marshal(data, use_fields)))
print(marshal(data, use_fields))
