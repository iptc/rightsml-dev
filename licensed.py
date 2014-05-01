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

class mklicense:

	def __init__(self,target, assigner, assignee):
		self.target = target
		self.assigner = assigner
		self.assignee = assignee

	def simpleGeographic(self, geography):
		return simpleGeographic(target=self.target, assigner=self.assigner, assignee=self.assignee, geography=geography)

class simpleGeographic:

	def __init__(self,target, assigner, assignee, geography):
		self.target = target
		self.assigner = assigner
		self.assignee = assignee
		self.geography = geography
		self.type = 'http://www.w3.org/ns/odrl/2/#set'
		self.action = 'http://www.w3.org/ns/odrl/2/#distribute'
		self.constraint = 'http://www.w3.org/ns/odrl/2/#spatial'
		self.operator = 'http://www.w3.org/ns/odrl/2/#eq'
		self.guid = 'http://example.com/RightsML/policy/idGeog1'
	
	def xml(self):
		policy = etree.Element("{http://www.w3.org/ns/odrl/2/}policy",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		policy.set('uid', self.guid)
		policy.set('type', self.type)

		permission = etree.Element("{http://www.w3.org/ns/odrl/2/}permission",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		policy.append(permission)

		asset = etree.Element("{http://www.w3.org/ns/odrl/2/}asset",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		asset.set('uid', self.target)
		asset.set('relation', 'http://www.w3.org/ns/odrl/2/#target')
		policy.append(asset)

		action = etree.Element("{http://www.w3.org/ns/odrl/2/}action",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		action.set('name', self.action)
		policy.append(action)

		constraint = etree.Element("{http://www.w3.org/ns/odrl/2/}constraint",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		constraint.set('name', self.constraint)
		constraint.set('operator', self.operator)
		constraint.set('rightOperand', self.geography)
		policy.append(constraint)

		party = etree.Element("{http://www.w3.org/ns/odrl/2/}party",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		party.set('function', 'http://www.w3.org/ns/odrl/2/')
		party.set('uid', self.assigner)
		policy.append(party)

		party = etree.Element("{http://www.w3.org/ns/odrl/2/}party",
			nsmap={'o': 'http://www.w3.org/ns/odrl/2/'})
		party.set('function', 'http://www.w3.org/ns/odrl/2/')
		party.set('uid', self.assignee)
		policy.append(party)

		return etree.tostring(policy)
