#!/usr/bin/python

try:
  from lxml import etree
  print("running with lxml.etree")
except ImportError:
  try:
    # Python 2.5
    import xml.etree.cElementTree as etree
    print("running with cElementTree on Python 2.5+")
  except ImportError:
    try:
      # Python 2.5
      import xml.etree.ElementTree as etree
      print("running with ElementTree on Python 2.5+")
    except ImportError:
      try:
        # normal cElementTree install
        import cElementTree as etree
        print("running with cElementTree")
      except ImportError:
        try:
          # normal ElementTree install
          import elementtree.ElementTree as etree
          print("running with ElementTree")
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
		self.type = 'http://w3.org/ns/odrl/vocab#set'
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
		asset.set('relation', 'http://w3.org/ns/odrl/vocab#target')
		policy.append(asset)

		return etree.tostring(policy)
