#!/usr/bin/python

from licensed import mklicense
import json
 
class SimpleLicenseJSON:

	def __init__(self):
		self.licenseFactory = mklicense(target="urn:newsml:example.com:20090101:120111-999-000013", 
			assigner="http://example.com/cv/party/epa",
			assignee="http://example.com/cv/policy/group/epapartners")

	def simple_action(self):
		actionlicense = self.licenseFactory.simpleAction(action="http://www.w3.org/ns/odrl/2/print")

		return actionlicense.json()


class SimpleLicenseXML:

	def __init__(self):
		self.licenseFactory = mklicense(target="urn:newsml:example.com:20090101:120111-999-000013", 
			assigner="http://example.com/cv/party/epa",
			assignee="http://example.com/cv/policy/group/epapartners")

	def simple_channel(self):
		channellicense = self.licenseFactory.simpleChannel(channel="http://example.com/cv/audMedia/MOBILE")

		channellicense_xml = channellicense.xml()

		return channellicense_xml

	def simple_timeperiod(self):
		timeperiodlicense = self.licenseFactory.simpleTimePeriod(timeperiod="2013-06-15")

		timeperiodlicense_xml = timeperiodlicense.xml()

		return timeperiodlicense_xml

	def test_simple_duty(self):
		dutylicense = self.licenseFactory.simpleDutyToPay(action="http://www.w3.org/ns/odrl/2/print",
				rightoperand="100.00",
				rightoperandunit="http://cvx.iptc.org/iso4217a/EUR",
				payee="http://example.com/cv/party/epa")

		dutylicense_xml = dutylicense.xml()

		self.assertIn("payAmount", dutylicense_xml)
		self.assertIn("payee", dutylicense_xml)
		self.assertIn("100.00", dutylicense_xml)

	def test_simple_duty_next_policy(self):
		dutylicense = self.licenseFactory.simpleDutyNextPolicy(action="http://www.w3.org/ns/odrl/2/sublicense",
				policy="http://example.com/policy/99")

		dutylicense_xml = dutylicense.xml()

		self.assertIn("sublicense", dutylicense_xml)
		self.assertIn("policy/99", dutylicense_xml)

	def test_simple_duty_refer_to_terms(self):
		dutylicense = self.licenseFactory.simpleDutyReferToTerms(termslist=["#idOfRightsInfo1", "#idOfRightsInfo2"])

		dutylicense_xml = dutylicense.xml()

		self.assertIn("reviewPolicy", dutylicense_xml)
		self.assertIn("idOfRightsInfo1", dutylicense_xml)

	def test_simple_geo(self):
		geolicense = self.licenseFactory.simpleGeographic(geography="http://cvx.iptc.org/iso3166-1a3/DEU")

		geolicense_xml = geolicense.xml()

		self.assertIn("DEU", geolicense_xml)
		self.assertIn("epa", geolicense_xml)
		self.assertIn("spatial", geolicense_xml)

	def test_simple_geo_not(self):
		geolicense = self.licenseFactory.simpleGeographic(geography="http://cvx.iptc.org/iso3166-1a3/DEU",
				operator="http://www.w3.org/ns/odrl/2/neq")

		geolicense_xml = geolicense.xml()

		self.assertIn("DEU", geolicense_xml)
		self.assertIn("epa", geolicense_xml)
		self.assertIn("spatial", geolicense_xml)
		self.assertIn("neq", geolicense_xml)

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

class CombinedLicenseXMLTest:

	def setUp(self):
		self.licenseFactory = mklicense(target="urn:newsml:example.com:20090101:120111-999-000013", 
			assigner="http://example.com/cv/party/epa",
			assignee="http://example.com/cv/policy/group/epapartners")

	def tearDown(self):
		pass

	def test_combined_geographic_and_next_policy(self):
		combined_geo_duty = self.licenseFactory.combinedGeoNextPolicy(geography="http://cvx.iptc.org/iso3166-1a3/DEU", action="http://www.w3.org/ns/odrl/2/sublicense", policy="http://epa.eu/cv/policy/3")
		combined_geo_duty_xml = combined_geo_duty.xml()

		self.assertIn("DEU", combined_geo_duty_xml)
		self.assertIn("epa", combined_geo_duty_xml)
		self.assertIn("sublicense", combined_geo_duty_xml)
		self.assertIn("policy/3", combined_geo_duty_xml)
		self.assertIn("spatial", combined_geo_duty_xml)
		self.assertIn("eq", combined_geo_duty_xml)
		self.assertIn("duty", combined_geo_duty_xml)



if __name__ == '__main__':
	licenseFactory = mklicense(target="urn:newsml:example.com:20090101:120111-999-000013", 
		assigner="http://example.com/cv/party/epa",
		assignee="http://example.com/cv/policy/group/epapartners")

	actionlicense = licenseFactory.simpleAction(action="http://www.w3.org/ns/odrl/2/print")

	print(actionlicense.json())

	print(actionlicense.xml())

	print("##################")

	channellicense = licenseFactory.simpleChannel(channel="http://example.com/cv/audMedia/MOBILE")

	print(channellicense.json())

	print(channellicense.xml())

	print("##################")

