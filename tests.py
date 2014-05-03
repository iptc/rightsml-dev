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

from licensed import mklicense
import unittest
 
class SimpleLicenseTest(unittest.TestCase):

	def setUp(self):
		self.licenseFactory = mklicense(target="urn:newsml:example.com:20090101:120111-999-000013", 
			assigner="http://example.com/cv/party/epa",
			assignee="http://example.com/cv/policy/group/epapartners")

	def tearDown(self):
		pass

	def test_simple_action(self):
		actionlicense = self.licenseFactory.simpleAction(action="http://www.w3.org/ns/odrl/2/print")

		actionlicense_xml = actionlicense.xml()

		self.assertIn("http://www.w3.org/ns/odrl/2/print", actionlicense_xml)
		self.assertIn("epa", actionlicense_xml)

	def test_simple_channel(self):
		channellicense = self.licenseFactory.simpleChannel(channel="http://example.com/cv/audMedia/MOBILE")

		channellicense_xml = channellicense.xml()

		self.assertIn("http://example.com/cv/audMedia/MOBILE", channellicense_xml)
		self.assertIn("epa", channellicense_xml)

	def test_simple_timeperiod(self):
		timeperiodlicense = self.licenseFactory.simpleTimePeriod(timeperiod="2013-06-15")

		timeperiodlicense_xml = timeperiodlicense.xml()

		self.assertIn("2013-06-15", timeperiodlicense_xml)
		self.assertIn("epa", timeperiodlicense_xml)

	def test_simple_geo(self):
		geolicense = self.licenseFactory.simpleGeographic(geography="http://cvx.iptc.org/iso3166-1a3/DEU")

		geolicense_xml = geolicense.xml()

		self.assertIn("DEU", geolicense_xml)
		self.assertIn("epa", geolicense_xml)

	def test_simple_geo_not(self):
		geolicense = self.licenseFactory.simpleGeographic(geography="http://cvx.iptc.org/iso3166-1a3/DEU",
				operator="http://www.w3.org/ns/odrl/2/neq")

		geolicense_xml = geolicense.xml()

		self.assertIn("DEU", geolicense_xml)
		self.assertIn("epa", geolicense_xml)

	def test_simple_geo_uid_is_unique(self):
		geolicense_deu = self.licenseFactory.simpleGeographic(geography="http://cvx.iptc.org/iso3166-1a3/DEU")
		geolicense_deu_xml = geolicense_deu.xml_etree()

		geolicense_fra = self.licenseFactory.simpleGeographic(geography="http://cvx.iptc.org/iso3166-1a3/FRA")
		geolicense_fra_xml = geolicense_fra.xml_etree()

		geolicense_deu_uid = geolicense_deu_xml.xpath("/o:policy/@uid", namespaces={'o' : 'http://www.w3.org/ns/odrl/2/'})
		geolicense_fra_uid = geolicense_fra_xml.xpath("/o:policy/@uid", namespaces={'o' : 'http://www.w3.org/ns/odrl/2/'})

		self.assertNotEqual(geolicense_deu_uid, geolicense_fra_uid)

	def test_simple_geo_uid_is_not_duplicated_for_same_parameters_for_action_and_constraint(self):
		geolicense_deu = self.licenseFactory.simpleGeographic(geography="http://cvx.iptc.org/iso3166-1a3/DEU")
		geolicense_deu_xml = geolicense_deu.xml_etree()

		actionlicense = self.licenseFactory.simpleAction(action="'http://www.w3.org/ns/odrl/2/distribute")

		actionlicense_xml = actionlicense.xml_etree()

		geolicense_deu_uid = geolicense_deu_xml.xpath("/o:policy/@uid", namespaces={'o' : 'http://www.w3.org/ns/odrl/2/'})
		actionlicense_uid = actionlicense_xml.xpath("/o:policy/@uid", namespaces={'o' : 'http://www.w3.org/ns/odrl/2/'})

		self.assertNotEqual(geolicense_deu_uid, actionlicense_uid)

	def test_simple_geo_uid_is_always_the_same_for_the_same_policy(self):
		geolicense_deu_1 = self.licenseFactory.simpleGeographic(geography="http://cvx.iptc.org/iso3166-1a3/DEU")
		geolicense_deu_xml_1 = geolicense_deu_1.xml_etree()

		geolicense_deu_2 = self.licenseFactory.simpleGeographic(geography="http://cvx.iptc.org/iso3166-1a3/DEU")
		geolicense_deu_xml_2 = geolicense_deu_2.xml_etree()

		geolicense_deu_uid_1 = geolicense_deu_xml_1.xpath("/o:policy/@uid", namespaces={'o' : 'http://www.w3.org/ns/odrl/2/'})
		geolicense_deu_uid_2 = geolicense_deu_xml_2.xpath("/o:policy/@uid", namespaces={'o' : 'http://www.w3.org/ns/odrl/2/'})

		self.assertEqual(geolicense_deu_uid_1, geolicense_deu_uid_2)

	def test_valid_odrl(self):
		self.fail("Finish the tests!")

if __name__ == '__main__':
	unittest.main()
