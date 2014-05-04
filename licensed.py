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
import json

class mklicense(object):

	def __init__(self,target, assigner, assignee):
		self.target = target
		self.assigner = assigner
		self.assignee = assignee

	def simpleAction(self, action):
		return simpleAction(target=self.target, assigner=self.assigner, assignee=self.assignee, action=action)

	def simpleGeographic(self, geography, operator="http://www.w3.org/ns/odrl/2/eq"):
		return simpleGeographic(target=self.target, assigner=self.assigner, assignee=self.assignee, geography=geography, operator=operator)

	def simpleTimePeriod(self, timeperiod, operator="http://www.w3.org/ns/odrl/2/lt"):
		return simpleTimePeriod(target=self.target, assigner=self.assigner, assignee=self.assignee, timeperiod=timeperiod, operator=operator)

	def simpleChannel(self, channel, operator="http://www.w3.org/ns/odrl/2/eq"):
		return simpleChannel(target=self.target, assigner=self.assigner, assignee=self.assignee, channel=channel, operator=operator)

class odrl(object):

	def __init__(self):
		self.odrl = {}

	def json(self):
		return json.dumps(self.odrl)

class rightsml(odrl):

	def __init__(self):
		super(rightsml, self).__init__()
		self.odrl['policytype'] = 'http://www.w3.org/ns/odrl/2/set'

class simpleAction(rightsml):

	def __init__(self,target, assigner, assignee, action):
		super(simpleAction, self).__init__()
		self.odrl['permissions'] = [{'target' : target, 'assigner' : assigner, 'assignee' : assignee, 'action' : action}]
		hashedparams = hashlib.md5(self.json())
		self.odrl['policyid'] = 'http://example.com/RightsML/policy/' + hashedparams.hexdigest()
	
	def xml(self):
		return etree.tostring(self.xml_etree())

	def xml_etree_policy(self, uid, type):
		policy = etree.Element("{http://www.w3.org/ns/odrl/2/}policy",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		policy.set('uid', uid)
		policy.set('policytype', type)
		return policy
	
	def xml_etree_permissions(self):
		permission = etree.Element("{http://www.w3.org/ns/odrl/2/}permission",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		asset = etree.Element("{http://www.w3.org/ns/odrl/2/}asset",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		asset.set('uid', self.odrl['permissions'][0]['target'])
		asset.set('relation', 'http://www.w3.org/ns/odrl/2/#target')
		permission.append(asset)

		action = etree.Element("{http://www.w3.org/ns/odrl/2/}action",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		action.set('name', self.odrl['permissions'][0]['action'])
		permission.append(action)

		for constraint in self.xml_etree_permissions_constraints(): permission.append(constraint)

		for party in self.xml_etree_permissions_parties(): permission.append(party)

		for duty in self.xml_etree_permissions_duties(): permission.append(duty)

		return [permission]

	def xml_etree_permissions_constraints(self):
		return []

	def xml_etree_permissions_duties(self):
		return []

	def xml_etree_permissions_parties(self):
		assigner = etree.Element("{http://www.w3.org/ns/odrl/2/}party",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		assigner.set('function', 'http://www.w3.org/ns/odrl/2/assigner')
		assigner.set('uid', self.odrl['permissions'][0]['assigner'])

		assignee = etree.Element("{http://www.w3.org/ns/odrl/2/}party",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		assignee.set('function', 'http://www.w3.org/ns/odrl/2/assignee')
		assignee.set('uid', self.odrl['permissions'][0]['assignee'])

		return [assigner, assignee]

	def xml_etree_prohibitions(self):
		return []

	def xml_etree(self):
		policy = self.xml_etree_policy(uid=self.odrl['policyid'], type=self.odrl['policytype'])

		for permission in self.xml_etree_permissions(): policy.append(permission)

		for prohibition in self.xml_etree_prohibitions(): policy.append(prohibition)

		return policy

class simpleConstraint(simpleAction):

	def __init__(self, target, assigner, assignee, constraint, rightoperand, operator):
		super(simpleConstraint, self).__init__(target=target, assigner=assigner, assignee=assignee, action='http://www.w3.org/ns/odrl/2/distribute')
		self.odrl['permissions'][0]['rightoperand'] = rightoperand
		self.odrl['permissions'][0]['constraint'] = constraint
		self.odrl['permissions'][0]['operator'] = operator
		hashedparams = hashlib.md5(self.json())
		self.odrl['policyid'] = 'http://example.com/RightsML/policy/' + hashedparams.hexdigest()
	
	def xml(self):
		return etree.tostring(self.xml_etree())

	def xml_etree(self):
		policy = etree.Element("{http://www.w3.org/ns/odrl/2/}policy",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		policy.set('uid', self.odrl['policyid'])
		policy.set('policytype', self.odrl['policytype'])

		permission = etree.Element("{http://www.w3.org/ns/odrl/2/}permission",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		policy.append(permission)

		asset = etree.Element("{http://www.w3.org/ns/odrl/2/}asset",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		asset.set('uid', self.odrl['permissions'][0]['target'])
		asset.set('relation', 'http://www.w3.org/ns/odrl/2/#target')
		policy.append(asset)

		action = etree.Element("{http://www.w3.org/ns/odrl/2/}action",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		action.set('name', self.odrl['permissions'][0]['action'])
		policy.append(action)

		constraint = etree.Element("{http://www.w3.org/ns/odrl/2/}constraint",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		constraint.set('name', self.odrl['permissions'][0]['constraint'])
		constraint.set('operator', self.odrl['permissions'][0]['operator'])
		constraint.set('rightOperand', self.odrl['permissions'][0]['rightoperand'])
		policy.append(constraint)

		party = etree.Element("{http://www.w3.org/ns/odrl/2/}party",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		party.set('function', 'http://www.w3.org/ns/odrl/2/')
		party.set('uid', self.odrl['permissions'][0]['assigner'])
		policy.append(party)

		party = etree.Element("{http://www.w3.org/ns/odrl/2/}party",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		party.set('function', 'http://www.w3.org/ns/odrl/2/')
		party.set('uid', self.odrl['permissions'][0]['assignee'])
		policy.append(party)

		return policy

class simpleTimePeriod(simpleConstraint):

	def __init__(self,target, assigner, assignee, timeperiod, operator):
		super(simpleTimePeriod, self).__init__(target=target, assigner=assigner, assignee=assignee, constraint='http://www.w3.org/ns/odrl/2/dateTime', operator=operator, rightoperand=timeperiod)
	
class simpleGeographic(simpleConstraint):

	def __init__(self,target, assigner, assignee, geography, operator):
		super(simpleGeographic, self).__init__(target=target, assigner=assigner, assignee=assignee, constraint='http://www.w3.org/ns/odrl/2/dateTime', operator=operator, rightoperand=geography)

class simpleChannel(simpleConstraint):

	def __init__(self,target, assigner, assignee, channel, operator):
		super(simpleChannel, self).__init__(target=target, assigner=assigner, assignee=assignee, constraint='http://www.w3.org/ns/odrl/2/purpose', operator=operator, rightoperand=channel)
