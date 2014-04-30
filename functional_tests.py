#!/usr/bin/python

from licensed import mklicense
import unittest
 
class SimpleLicenseTest(unittest.TestCase):

	def setUp(self):
		self.licenseFactory = mklicense(target="urn:newsml:example.com:20090101:120111-999-000013", 
			assigner="http://example.com/cv/party/epa",
			assignee="http://example.com/cv/policy/group/epapartners")

	def tearDown(self):
		pass

	def test_simple_geo(self):
		geolicense = self.licenseFactory.simpleGeographic(geography="http://cvx.iptc.org/iso3166-1a3/DEU")

		geolicense_xml = geolicense.xml()

		assert "DEU" in geolicense_xml, "Geo License XML was" + geolicense_xml
