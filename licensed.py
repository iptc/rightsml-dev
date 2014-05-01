#!/usr/bin/python

try:
  from lxml import etree
except ImportError:
  try:
    # Python 2.5
    import xml.etree.cElementTree as etree
  except ImportError:
    try:
      # Python 2.5
      import xml.etree.ElementTree as etree
    except ImportError:
      try:
        # normal cElementTree install
        import cElementTree as etree
      except ImportError:
        try:
          # normal ElementTree install
          import elementtree.ElementTree as etree
        except ImportError:
          print("Failed to import ElementTree from any known place")

import hashlib

class mklicense:

	def __init__(self,target, assigner, assignee):
		self.target = target
		self.assigner = assigner
		self.assignee = assignee

	def simpleGeographic(self, geography):
		return simpleGeographic(target=self.target, assigner=self.assigner, assignee=self.assignee, geography=geography)

class simpleGeographic:

	def __init__(self,target, assigner, assignee, geography):
		self.vals = {}
		self.vals['target'] = target
		self.vals['assigner'] = assigner
		self.vals['assignee'] = assignee
		self.vals['geography'] = geography
		self.vals['type'] = 'http://www.w3.org/ns/odrl/2/#set'
		self.vals['action'] = 'http://www.w3.org/ns/odrl/2/#distribute'
		self.vals['constraint'] = 'http://www.w3.org/ns/odrl/2/#spatial'
		self.vals['operator'] = 'http://www.w3.org/ns/odrl/2/#eq'
		hashedparams = hashlib.md5(''.join('%s%s' % (k,v) for k,v in self.vals.items()))
		self.vals['guid'] = 'http://example.com/RightsML/policy/' + hashedparams.hexdigest()
	
	def xml(self):
		return etree.tostring(self.xml_etree())

	def xml_etree(self):
		policy = etree.Element("{http://www.w3.org/ns/odrl/2/}policy",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		policy.set('uid', self.vals['guid'])
		policy.set('type', self.vals['type'])

		permission = etree.Element("{http://www.w3.org/ns/odrl/2/}permission",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		policy.append(permission)

		asset = etree.Element("{http://www.w3.org/ns/odrl/2/}asset",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		asset.set('uid', self.vals['target'])
		asset.set('relation', 'http://www.w3.org/ns/odrl/2/#target')
		policy.append(asset)

		action = etree.Element("{http://www.w3.org/ns/odrl/2/}action",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		action.set('name', self.vals['action'])
		policy.append(action)

		constraint = etree.Element("{http://www.w3.org/ns/odrl/2/}constraint",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		constraint.set('name', self.vals['constraint'])
		constraint.set('operator', self.vals['operator'])
		constraint.set('rightOperand', self.vals['geography'])
		policy.append(constraint)

		party = etree.Element("{http://www.w3.org/ns/odrl/2/}party",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		party.set('function', 'http://www.w3.org/ns/odrl/2/')
		party.set('uid', self.vals['assigner'])
		policy.append(party)

		party = etree.Element("{http://www.w3.org/ns/odrl/2/}party",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		party.set('function', 'http://www.w3.org/ns/odrl/2/')
		party.set('uid', self.vals['assignee'])
		policy.append(party)

		return policy
