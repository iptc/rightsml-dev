#!/usr/bin/python

try:
  from lxml import etree
  lxmlavailable=True
except ImportError:
  lxmlavailable=False
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

from StringIO import *
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

	def simpleDutyToPay(self, action, rightoperand, rightoperandunit, payee, operator="http://www.w3.org/ns/odrl/2/eq"):
		return simpleDutyToPay(target=self.target, assigner=self.assigner, assignee=self.assignee, action=action, rightoperand=rightoperand, rightoperandunit=rightoperandunit, payee=payee, operator=operator)

	def simpleDutyNextPolicy(self, action, policy):
		return simpleDutyNextPolicy(target=self.target, assigner=self.assigner, assignee=self.assignee, action=action, policy=policy)

	def simpleDutyReferToTerms(self, termslist, action="http://www.w3.org/ns/odrl/2/distribute"):
		return simpleDutyReferToTerms(target=self.target, assigner=self.assigner, assignee=self.assignee, action=action, termslist=termslist)

	def combinedGeoNextPolicy(self, geography, action, policy):
		return combinedGeoNextPolicy(target=self.target, assigner=self.assigner, assignee=self.assignee, geography=geography, action=action, policy=policy)

	def combinedGeoTimePeriod(self, geography, action, timeperiod, geooperator):
		return combinedGeoTimePeriod(target=self.target, assigner=self.assigner, assignee=self.assignee, geography=geography, action=action, timeperiod=timeperiod, geooperator=geooperator)

class odrl(object):

	def __init__(self, profile=None):
		self.odrl = {}
		if profile != None:
			self.odrl["policyprofile"] = profile

	def json(self):
		return json.dumps(self.odrl, sort_keys=True, indent=4)

	def xml(self, pretty_print=True):
		if lxmlavailable:
			return etree.tostring(self.xml_etree(), pretty_print = pretty_print)
		else:
			return etree.tostring(self.xml_etree())

	def xml_etree_permissions_prohibitions(self, type):
		permissions_prohibitions = []
		if type+"s" in self.odrl:
			for p in self.odrl[type+"s"]:
				permission_prohibition = etree.Element("{http://www.w3.org/ns/odrl/2/}" + type,
					nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
				asset = etree.Element("{http://www.w3.org/ns/odrl/2/}asset",
					nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
				asset.set('uid', p['target'])
				asset.set('relation', 'http://www.w3.org/ns/odrl/2/target')
				permission_prohibition.append(asset)

				action = etree.Element("{http://www.w3.org/ns/odrl/2/}action",
					nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
				action.set('name', p['action'])
				permission_prohibition.append(action)

				if "constraints" in p:
					for c in p["constraints"]:
						constraint = etree.Element("{http://www.w3.org/ns/odrl/2/}constraint",
							nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
						constraint.set('name', c['name'])
						constraint.set('operator', c['operator'])
						constraint.set('rightOperand', c['rightoperand'])
						if "rightoperanddatatype" in c:
							constraint.set('dataType', c['rightoperanddatatype'])
						if "rightoperandunit" in c:
							constraint.set('unit', c['rightoperandunit'])
						if "status" in c:
							constraint.set('status', c['status'])
						permission_prohibition.append(constraint)

				if "assigner" in p:
					assigner = etree.Element("{http://www.w3.org/ns/odrl/2/}party",
						nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
					assigner.set('function', 'http://www.w3.org/ns/odrl/2/assigner')
					assigner.set('uid', p['assigner'])
					if "assigner_scope" in p:
						assigner.set('scope', p['assigner_scope'])
					permission_prohibition.append(assigner)

				if "assignee" in p:
					assignee = etree.Element("{http://www.w3.org/ns/odrl/2/}party",
						nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
					assignee.set('function', 'http://www.w3.org/ns/odrl/2/assignee')
					assignee.set('uid', p['assignee'])
					if "assignee_scope" in p:
						assignee.set('scope', p['assignee_scope'])
					permission_prohibition.append(assignee)

				if "duties" in p:
					for d in p["duties"]:
						duty = etree.Element("{http://www.w3.org/ns/odrl/2/}duty",
							nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})

						action = etree.Element("{http://www.w3.org/ns/odrl/2/}action",
							nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
						action.set('name', d['action'])
						duty.append(action)

						if "target" in d:
							asset = etree.Element("{http://www.w3.org/ns/odrl/2/}asset",
								nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
							asset.set('uid', d['target'])
							asset.set('relation', 'http://www.w3.org/ns/odrl/2/target')
							duty.append(asset)

						if "assets" in d:
							for a in d["assets"]:
								asset = etree.Element("{http://www.w3.org/ns/odrl/2/}asset",
									nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
								asset.set('uid', a)
								duty.append(asset)

						if "constraints" in d:
							for c in d["constraints"]:
								constraint = etree.Element("{http://www.w3.org/ns/odrl/2/}constraint",
									nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
								constraint.set('name', c['name'])
								constraint.set('operator', c['operator'])
								constraint.set('rightOperand', c['rightoperand'])
								if "rightoperanddatatype" in c:
									constraint.set('dataType', c['rightoperanddatatype'])
								if "rightoperandunit" in c:
									constraint.set('unit', c['rightoperandunit'])
								if "status" in c:
									constraint.set('status', c['status'])
								duty.append(constraint)

						if "attributedparty" in d:
							attributedparty = etree.Element("{http://www.w3.org/ns/odrl/2/}party",
								nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
							attributedparty.set('function', 'http://www.w3.org/ns/odrl/2/attributedParty')
							attributedparty.set('uid', d['attributedparty'])
							duty.append(attributedparty)

						if "consentingparty" in d:
							consentingparty = etree.Element("{http://www.w3.org/ns/odrl/2/}party",
								nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
							consentingparty.set('function', 'http://www.w3.org/ns/odrl/2/consentingParty')
							consentingparty.set('uid', d['consentingparty'])
							duty.append(consentingparty)

						if "informedparty" in d:
							informedparty = etree.Element("{http://www.w3.org/ns/odrl/2/}party",
								nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
							informedparty.set('function', 'http://www.w3.org/ns/odrl/2/informedParty')
							informedparty.set('uid', d['informedparty'])
							duty.append(informedparty)

						if "payeeparty" in d:
							payeeparty = etree.Element("{http://www.w3.org/ns/odrl/2/}party",
								nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
							payeeparty.set('function', 'http://www.w3.org/ns/odrl/2/payeeParty')
							payeeparty.set('uid', d['payeeparty'])
							duty.append(payeeparty)

						if "trackingparty" in d:
							trackingparty = etree.Element("{http://www.w3.org/ns/odrl/2/}party",
								nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
							trackingparty.set('function', 'http://www.w3.org/ns/odrl/2/trackingParty')
							trackingparty.set('uid', d['trackingparty'])
							duty.append(trackingparty)

						permission_prohibition.append(duty)

				permissions_prohibitions.append(permission_prohibition)

		return permissions_prohibitions

	def xml_etree(self):
		policy = etree.Element("{http://www.w3.org/ns/odrl/2/}Policy",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		policy.set('uid', self.odrl['policyid'])
		policy.set('type', self.odrl['policytype'])
		if self.odrl['policyprofile'] != None:
			policy.set('profile', self.odrl['policyprofile'])

		for permission in self.xml_etree_permissions_prohibitions(type="permission"):
			policy.append(permission)

		for prohibition in self.xml_etree_permissions_prohibitions(type="prohibition"):
			policy.append(prohibition)

		return policy

	# Permissions and prohibitions have the same structure
	def xml_permissions_prohibitions_to_json(self, type, policy):
		permissions_prohibitions = []

		for permission_prohibition in [p for p in policy if p.tag == "{http://www.w3.org/ns/odrl/2/}"+type]:
			# In ODRL, a permission/prohibition must have an asset element and an action element
			# So, we can rely on them being there, in that order
			# Yeah, I know.
			target = permission_prohibition[0].get("uid")
			action = permission_prohibition[1].get("name")
			permission_prohibition_obj = { 'target' : target, 'action' : action}

			constraints = []

			for constraint in [c for c in permission_prohibition if c.tag == "{http://www.w3.org/ns/odrl/2/}constraint"]:
				name = constraint.get('name')
				operator = constraint.get('operator')
				rightoperand = constraint.get('rightOperand')
				constraint_obj = { 'name' : name, 'operator' : operator, 'rightoperand' : rightoperand }

				if constraint.get('dataType') != None:
					constraint_obj['rightoperanddatatype'] = constraint.get('dataType')
				if constraint.get('unit') != None:
					constraint_obj['rightoperandunit'] = constraint.get('unit')
				if constraint.get('status') != None:
					constraint_obj['status'] = constraint.get('status')

				constraints.append(constraint_obj)

			# Constraints are optional
			if len(constraints) > 0:
				permission_prohibition_obj['constraints'] = constraints

			for party in [p for p in permission_prohibition if p.tag == "{http://www.w3.org/ns/odrl/2/}party"]:
				if party.get('function') == 'http://www.w3.org/ns/odrl/2/assigner':
					permission_prohibition_obj['assigner'] = party.get('uid')
					if party.get('scope') != None:
						permission_prohibition_object['assigner_scope'] = party.get('scope')
				elif party.get('function') == 'http://www.w3.org/ns/odrl/2/assignee':
					permission_prohibition_obj['assignee'] = party.get('uid')
					if party.get('scope') != None:
						permission_prohibition_object['assignee_scope'] = party.get('scope')

			duties = []
			for duty in [d for d in permission_prohibition if d.tag == "{http://www.w3.org/ns/odrl/2/}duty"]:
				duty_obj = {}
				action = duty[0].get("name")

				duty_obj['action'] = action

				assets = []
				for asset in [a for a in duty if a.tag == "{http://www.w3.org/ns/odrl/2/}asset"]:
					if asset.get('relation') == 'http://www.w3.org/ns/odrl/2/target':
						duty_obj['target'] = asset.get('uid')
					else:
						asset.append(asset.get('uid'))

				if len(assets) > 0:
					duty_obj['assets'] = assets

				constraints = []
				for constraint in [c for c in duty if c.tag == "{http://www.w3.org/ns/odrl/2/}constraint"]:
					name = constraint.get('name')
					operator = constraint.get('operator')
					rightoperand = constraint.get('rightOperand')
					constraint_obj = { 'name' : name, 'operator' : operator, 'rightoperand' : rightoperand }

					if constraint.get('dataType') != None:
						constraint_obj['rightoperanddatatype'] = constraint.get('dataType')
					if constraint.get('unit') != None:
						constraint_obj['rightoperandunit'] = constraint.get('unit')
					if constraint.get('status') != None:
						constraint_obj['status'] = constraint.get('status')

					constraints.append(constraint_obj)

				# Constraints are optional
				if len(constraints) > 0:
					duty_obj['constraints'] = constraints

				for party in [p for p in duty if p.tag == "{http://www.w3.org/ns/odrl/2/}party"]:
					party_function = party.get('function')
					party_uid = party.get('uid')
					if party_function == 'http://www.w3.org/ns/odrl/2/payeeParty':
						duty_obj['payeeparty'] = party_uid
					elif party_function == 'http://www.w3.org/ns/odrl/2/attributedParty':
						duty_obj['attributedparty'] = party_uid
					elif party_function == 'http://www.w3.org/ns/odrl/2/consentingParty':
						duty_obj['consentingparty'] = party_uid
					elif party_function == 'http://www.w3.org/ns/odrl/2/informedParty':
						duty_obj['informedparty'] = party_uid
					elif party_function == 'http://www.w3.org/ns/odrl/2/trackingParty':
						duty_obj['trackingparty'] = party_uid

				duties.append(duty_obj)

			if len(duties) > 0:
				permission_prohibition_obj['duties'] = duties

			permissions_prohibitions.append(permission_prohibition_obj)

		
		if len(permissions_prohibitions) > 0:
			self.odrl[type+'s'] = permissions_prohibitions

	def xml2json(self, theXML):
		odrl_tree = etree.parse(StringIO(theXML))

		for policy in odrl_tree.xpath('/o:Policy', namespaces={'o': 'http://www.w3.org/ns/odrl/2/'}):
			self.odrl['policyid'] = policy.get('uid')
			self.odrl['policytype'] = policy.get('type')

			self.xml_permissions_prohibitions_to_json("permission", policy)

			self.xml_permissions_prohibitions_to_json("prohibition", policy)

		return self.json()


class rightsml(odrl):

	def __init__(self):
		super(rightsml, self).__init__()
		self.odrl['policytype'] = 'http://www.w3.org/ns/odrl/2/Set'
		self.odrl['policyprofile'] = 'http://www.iptc.org/std/RightsML/'

class simpleAction(rightsml):

	def __init__(self,target, assigner, assignee, action):
		super(simpleAction, self).__init__()
		self.odrl['permissions'] = [{'target' : target, 'assigner' : assigner, 'assignee' : assignee, 'action' : action}]
		hashedparams = hashlib.md5(self.json())
		self.odrl['policyid'] = 'http://example.com/RightsML/policy/' + hashedparams.hexdigest()

class simpleConstraint(simpleAction):

	def __init__(self, target, assigner, assignee, constraint, rightoperand, operator):
		super(simpleConstraint, self).__init__(target=target, assigner=assigner, assignee=assignee, action='http://www.w3.org/ns/odrl/2/distribute')
		self.odrl['permissions'][0]['constraints'] = [{'rightoperand' : rightoperand, 'name' : constraint, 'operator' : operator}]
		hashedparams = hashlib.md5(self.json())
		self.odrl['policyid'] = 'http://example.com/RightsML/policy/' + hashedparams.hexdigest()
	
class simpleTimePeriod(simpleConstraint):

	def __init__(self,target, assigner, assignee, timeperiod, operator):
		super(simpleTimePeriod, self).__init__(target=target, assigner=assigner, assignee=assignee, constraint='http://www.w3.org/ns/odrl/2/dateTime', operator=operator, rightoperand=timeperiod)
	
class simpleGeographic(simpleConstraint):

	def __init__(self,target, assigner, assignee, geography, operator):
		super(simpleGeographic, self).__init__(target=target, assigner=assigner, assignee=assignee, constraint='http://www.w3.org/ns/odrl/2/spatial', operator=operator, rightoperand=geography)

class simpleChannel(simpleConstraint):

	def __init__(self,target, assigner, assignee, channel, operator):
		super(simpleChannel, self).__init__(target=target, assigner=assigner, assignee=assignee, constraint='http://www.w3.org/ns/odrl/2/purpose', operator=operator, rightoperand=channel)

class simpleDuty():

	def __init__(self, target, assigner, assignee, duty, constraint, action, rightoperand, operator, rightoperandunit, party, partytype):
		super(simpleDuty, self).__init__(target=target, assigner=assigner, assignee=assignee, action='http://www.w3.org/ns/odrl/2/distribute')

class simpleDutyToPay(simpleAction):

	def __init__(self,target, assigner, assignee, action, rightoperand, rightoperandunit, payee, operator='http://www.w3.org/ns/odrl/2/eq'):
		super(simpleDutyToPay, self).__init__(target=target, assigner=assigner, assignee=assignee, action=action)
		self.odrl['permissions'][0]['duties']= [{'action' : 'http://www.w3.org/ns/odrl/2/pay', 'payeeparty' : payee, 'constraints': [{'rightoperand' : rightoperand, 'name' : 'http://www.w3.org/ns/odrl/2/payAmount', 'operator' : operator, 'rightoperandunit' : rightoperandunit}]}]
		hashedparams = hashlib.md5(self.json())
		self.odrl['policyid'] = 'http://example.com/RightsML/policy/' + hashedparams.hexdigest()

class simpleDutyNextPolicy(simpleAction):

	def __init__(self, target, assigner, assignee, action, policy):
		super(simpleDutyNextPolicy, self).__init__(target=target, assigner=assigner, assignee=assignee, action=action)
		self.odrl['permissions'][0]['duties']= [{'action' : 'http://www.w3.org/ns/odrl/2/nextPolicy', 'target' : policy}]
		hashedparams = hashlib.md5(self.json())
		self.odrl['policyid'] = 'http://example.com/RightsML/policy/' + hashedparams.hexdigest()

class simpleDutyReferToTerms(simpleAction):

	def __init__(self, target, assigner, assignee, action, termslist):
		super(simpleDutyReferToTerms, self).__init__(target=target, assigner=assigner, assignee=assignee, action=action)
		duties = []
		for terms in termslist:
			duties.append({'action' : 'http://www.w3.org/ns/odrl/2/reviewPolicy', 'target' : terms})
		self.odrl['permissions'][0]['duties'] = duties
		hashedparams = hashlib.md5(self.json())

class combinedGeoNextPolicy(simpleAction):

	def __init__(self, target, assigner, assignee, geography, action, policy, operator='http://www.w3.org/ns/odrl/2/eq'):
		super(combinedGeoNextPolicy, self).__init__(target=target, assigner=assigner, assignee=assignee, action=action)
		self.odrl['permissions'][0]['constraints'] = [{'rightoperand' : geography, 'name' : 'http://www.w3.org/ns/odrl/2/spatial', 'operator' : operator}]
		self.odrl['permissions'][0]['duties']= [{'action' : 'http://www.w3.org/ns/odrl/2/nextPolicy', 'target' : policy}]
		hashedparams = hashlib.md5(self.json())

class combinedGeoTimePeriod(simpleAction):

	def __init__(self, target, assigner, assignee, geography, action, timeperiod, geooperator='http://www.w3.org/ns/odrl/2/eq', timeperiodoperator='http://www.w3.org/ns/odrl/2/lt'):
		super(combinedGeoTimePeriod, self).__init__(target=target, assigner=assigner, assignee=assignee, action=action)
		self.odrl['permissions'][0]['constraints'] = [{'rightoperand' : geography, 'name' : 'http://www.w3.org/ns/odrl/2/spatial', 'operator' : geooperator},
								{'rightoperand' : timeperiod, 'name' : 'http://www.w3.org/ns/odrl/2/dateTime', 'operator' : timeperiodoperator, 'rightoperanddatatype' : 'xs:dateTime'}]
		hashedparams = hashlib.md5(self.json())
		self.odrl['policyid'] = 'http://example.com/RightsML/policy/' + hashedparams.hexdigest()
