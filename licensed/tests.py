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
from licensed import odrl
import unittest
import json
import jsonschema
import hashlib
 
class SimpleLicenseJSONTest(unittest.TestCase):

	def setUp(self):
		self.licenseFactory = mklicense(target="urn:newsml:example.com:20090101:120111-999-000013", 
			assigner="http://example.com/cv/party/epa",
			assignee="http://example.com/cv/policy/group/epapartners")

		jsonfile =  open("ODRL21.json")
		odrlschema = json.load(jsonfile)
		self.odrlvalidator = jsonschema.Draft4Validator(odrlschema)

	def tearDown(self):
		pass

	def test_simple_action(self):
		actionlicense = self.licenseFactory.simpleAction(action="http://www.w3.org/ns/odrl/2/print")

		actionlicense_json = actionlicense.json()

		self.assertIn("http://www.w3.org/ns/odrl/2/print", actionlicense_json)
		self.assertIn("epa", actionlicense_json)

	def test_validate_entire_json_with_schema(self):
		channellicense = self.licenseFactory.simpleChannel(channel="http://example.com/cv/audMedia/MOBILE")

		channellicense_odrl = channellicense.odrl

		try:
			self.odrlvalidator.validate(channellicense_odrl)
		except jsonschema.exceptions.ValidationError as e:
			self.fail("ODRL JSON didn't validate: %s" % e.message)

	def test_validate_simple_duty(self):
		dutylicense = self.licenseFactory.simpleDutyToPay(action="http://www.w3.org/ns/odrl/2/print",
				rightoperand="100.00",
				rightoperandunit="http://cvx.iptc.org/iso4217a/EUR",
				payee="http://example.com/cv/party/epa")

		dutylicense_odrl = dutylicense.odrl

		try:
			self.odrlvalidator.validate(dutylicense_odrl)
		except jsonschema.exceptions.ValidationError as e:
			self.fail("ODRL JSON didn't validate: %s" % e.message)

class SimpleLicenseXMLTest(unittest.TestCase):

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

		geolicense_deu_uid = geolicense_deu_xml.xpath("/o:Policy/@uid", namespaces={'o' : 'http://www.w3.org/ns/odrl/2/'})
		geolicense_fra_uid = geolicense_fra_xml.xpath("/o:Policy/@uid", namespaces={'o' : 'http://www.w3.org/ns/odrl/2/'})

		self.assertNotEqual(geolicense_deu_uid, geolicense_fra_uid)

	def test_simple_geo_uid_is_not_duplicated_for_same_parameters_for_action_and_constraint(self):
		geolicense_deu = self.licenseFactory.simpleGeographic(geography="http://cvx.iptc.org/iso3166-1a3/DEU")
		geolicense_deu_xml = geolicense_deu.xml_etree()

		actionlicense = self.licenseFactory.simpleAction(action="'http://www.w3.org/ns/odrl/2/distribute")

		actionlicense_xml = actionlicense.xml_etree()

		geolicense_deu_uid = geolicense_deu_xml.xpath("/o:Policy/@uid", namespaces={'o' : 'http://www.w3.org/ns/odrl/2/'})
		actionlicense_uid = actionlicense_xml.xpath("/o:Policy/@uid", namespaces={'o' : 'http://www.w3.org/ns/odrl/2/'})

		self.assertNotEqual(geolicense_deu_uid, actionlicense_uid)

	def test_simple_geo_uid_is_always_the_same_for_the_same_policy(self):
		geolicense_deu_1 = self.licenseFactory.simpleGeographic(geography="http://cvx.iptc.org/iso3166-1a3/DEU")
		geolicense_deu_xml_1 = geolicense_deu_1.xml_etree()

		geolicense_deu_2 = self.licenseFactory.simpleGeographic(geography="http://cvx.iptc.org/iso3166-1a3/DEU")
		geolicense_deu_xml_2 = geolicense_deu_2.xml_etree()

		geolicense_deu_uid_1 = geolicense_deu_xml_1.xpath("/o:Policy/@uid", namespaces={'o' : 'http://www.w3.org/ns/odrl/2/'})
		geolicense_deu_uid_2 = geolicense_deu_xml_2.xpath("/o:Policy/@uid", namespaces={'o' : 'http://www.w3.org/ns/odrl/2/'})

		self.assertEqual(geolicense_deu_uid_1, geolicense_deu_uid_2)

	def test_valid_odrl(self):
		odrl_schema_doc = etree.parse("ODRL21.xsd")
		odrl_schema = etree.XMLSchema(odrl_schema_doc)

		geolicense_deu_1 = self.licenseFactory.simpleGeographic(geography="http://cvx.iptc.org/iso3166-1a3/DEU")
		if not odrl_schema(geolicense_deu_1.xml_etree()):
			log = odrl_schema.error_log
			error = log.last_error
			self.fail("Invalid ODRL %s" % error)

class CombinedLicenseTest(unittest.TestCase):

	def setUp(self):
		self.licenseFactory = mklicense(target="urn:newsml:example.com:20090101:120111-999-000013", 
			assigner="http://example.com/cv/party/epa",
			assignee="http://example.com/cv/policy/group/epapartners")

		odrl_schema_doc = etree.parse("ODRL21.xsd")
		self.odrl_schema = etree.XMLSchema(odrl_schema_doc)

		jsonfile =  open("ODRL21.json")
		odrlschema = json.load(jsonfile)
		self.odrlvalidator = jsonschema.Draft4Validator(odrlschema)

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

		if not self.odrl_schema(combined_geo_duty.xml_etree()):
			log = odrl_schema.error_log
			error = log.last_error
			self.fail("Invalid ODRL %s" % error)

		try:
			self.odrlvalidator.validate(combined_geo_duty.odrl)
		except jsonschema.exceptions.ValidationError as e:
			self.fail("ODRL JSON didn't validate: %s" % e.message)

	def test_combined_geographic_and_time_period_xml(self):
		combined_geo_duty = self.licenseFactory.combinedGeoTimePeriod(geography="http://cvx.iptc.org/iso3166-1a3/GBR", action="http://www.w3.org/ns/odrl/2/use", timeperiod="2013-06-15", geooperator="http://www.w3.org/ns/odrl/2/neq")
		combined_geo_duty_xml = combined_geo_duty.xml()

		self.assertIn("GBR", combined_geo_duty_xml)
		self.assertIn("epa", combined_geo_duty_xml)
		self.assertIn("use", combined_geo_duty_xml)
		self.assertIn("spatial", combined_geo_duty_xml)
		self.assertIn("neq", combined_geo_duty_xml)
		self.assertIn("lt", combined_geo_duty_xml)
		self.assertIn("2013-06-15", combined_geo_duty_xml)

		if not self.odrl_schema(combined_geo_duty.xml_etree()):
			log = odrl_schema.error_log
			error = log.last_error
			self.fail("Invalid ODRL %s" % error)

		try:
			self.odrlvalidator.validate(combined_geo_duty.odrl)
		except jsonschema.exceptions.ValidationError as e:
			self.fail("ODRL JSON didn't validate: %s" % e.message)

class ConvertXML2JSONTest(unittest.TestCase):

	def setUp(self):
		self.odrl_factory = odrl()

	def tearDown(self):
		pass

	def test_json_to_xml(self):
		simple_action_xml="""<o:Policy xmlns:o="http://www.w3.org/ns/odrl/2/" uid="http://example.com/RightsML/policy/803951be46345a69a2ef1fe5199a425d" type="http://www.w3.org/ns/odrl/2/Set">
  <o:permission>
    <o:asset uid="urn:newsml:example.com:20090101:120111-999-000013" relation="http://www.w3.org/ns/odrl/2/target"/>
    <o:action name="http://www.w3.org/ns/odrl/2/print"/>
    <o:party function="http://www.w3.org/ns/odrl/2/assigner" uid="http://example.com/cv/party/epa"/>
    <o:party function="http://www.w3.org/ns/odrl/2/assignee" uid="http://example.com/cv/policy/group/epapartners"/>
  </o:permission>
</o:Policy>"""

		simple_action_json="""{
    "permissions": [
        {
            "action": "http://www.w3.org/ns/odrl/2/print", 
            "assignee": "http://example.com/cv/policy/group/epapartners", 
            "assigner": "http://example.com/cv/party/epa", 
            "target": "urn:newsml:example.com:20090101:120111-999-000013"
        }
    ], 
    "policyid": "http://example.com/RightsML/policy/803951be46345a69a2ef1fe5199a425d", 
    "policytype": "http://www.w3.org/ns/odrl/2/Set"
}"""

		action_json = self.odrl_factory.xml2json(simple_action_xml)

		self.assertEqual(action_json, simple_action_json)

	def test_json_to_constraint_xml(self):

		simple_constraint_xml="""<o:Policy xmlns:o="http://www.w3.org/ns/odrl/2/" uid="http://example.com/RightsML/policy/6fa472b50272943c9671f775d96d2547" type="http://www.w3.org/ns/odrl/2/Set">
  <o:permission>
    <o:asset uid="urn:newsml:example.com:20090101:120111-999-000013" relation="http://www.w3.org/ns/odrl/2/target"/>
    <o:action name="http://www.w3.org/ns/odrl/2/distribute"/>
    <o:constraint name="http://www.w3.org/ns/odrl/2/dateTime" operator="http://www.w3.org/ns/odrl/2/lt" rightOperand="2013-06-15"/>
    <o:party function="http://www.w3.org/ns/odrl/2/assigner" uid="http://example.com/cv/party/epa"/>
    <o:party function="http://www.w3.org/ns/odrl/2/assignee" uid="http://example.com/cv/policy/group/epapartners"/>
  </o:permission>
</o:Policy>"""

		simple_constraint_json="""{
    "permissions": [
        {
            "action": "http://www.w3.org/ns/odrl/2/distribute", 
            "assignee": "http://example.com/cv/policy/group/epapartners", 
            "assigner": "http://example.com/cv/party/epa", 
            "constraints": [
                {
                    "name": "http://www.w3.org/ns/odrl/2/dateTime", 
                    "operator": "http://www.w3.org/ns/odrl/2/lt", 
                    "rightoperand": "2013-06-15"
                }
            ], 
            "target": "urn:newsml:example.com:20090101:120111-999-000013"
        }
    ], 
    "policyid": "http://example.com/RightsML/policy/6fa472b50272943c9671f775d96d2547", 
    "policytype": "http://www.w3.org/ns/odrl/2/Set"
}"""

		constraint_json = self.odrl_factory.xml2json(simple_constraint_xml)

		self.assertEqual(constraint_json, simple_constraint_json)

	def test_json_to_duty_xml(self):
		simple_duty_json="""{
    "permissions": [
        {
            "action": "http://www.w3.org/ns/odrl/2/sublicense", 
            "assignee": "http://example.com/cv/policy/group/epapartners", 
            "assigner": "http://example.com/cv/party/epa", 
            "duties": [
                {
                    "action": "http://www.w3.org/ns/odrl/2/nextPolicy", 
                    "target": "http://example.com/policy/99"
                }
            ], 
            "target": "urn:newsml:example.com:20090101:120111-999-000013"
        }
    ], 
    "policyid": "http://example.com/RightsML/policy/3526a64a774c5acd11f1fe51b18836b5", 
    "policytype": "http://www.w3.org/ns/odrl/2/Set"
}"""

		simple_duty_xml="""<o:Policy xmlns:o="http://www.w3.org/ns/odrl/2/" uid="http://example.com/RightsML/policy/3526a64a774c5acd11f1fe51b18836b5" type="http://www.w3.org/ns/odrl/2/Set">
  <o:permission>
    <o:asset uid="urn:newsml:example.com:20090101:120111-999-000013" relation="http://www.w3.org/ns/odrl/2/target"/>
    <o:action name="http://www.w3.org/ns/odrl/2/sublicense"/>
    <o:party function="http://www.w3.org/ns/odrl/2/assigner" uid="http://example.com/cv/party/epa"/>
    <o:party function="http://www.w3.org/ns/odrl/2/assignee" uid="http://example.com/cv/policy/group/epapartners"/>
    <o:duty>
      <o:action name="http://www.w3.org/ns/odrl/2/nextPolicy"/>
      <o:asset uid="http://example.com/policy/99" relation="http://www.w3.org/ns/odrl/2/target"/>
    </o:duty>
  </o:permission>
</o:Policy>"""

		duty_json = self.odrl_factory.xml2json(simple_duty_xml)

		self.assertEqual(duty_json, simple_duty_json)

	def test_json_to_payee_xml(self):
		simple_payee_json="""{
    "permissions": [
        {
            "action": "http://www.w3.org/ns/odrl/2/print", 
            "assignee": "http://example.com/cv/policy/group/epapartners", 
            "assigner": "http://example.com/cv/party/epa", 
            "duties": [
                {
                    "action": "http://www.w3.org/ns/odrl/2/pay", 
                    "constraints": [
                        {
                            "name": "http://www.w3.org/ns/odrl/2/payAmount", 
                            "operator": "http://www.w3.org/ns/odrl/2/eq", 
                            "rightoperand": "100.00", 
                            "rightoperandunit": "http://cvx.iptc.org/iso4217a/EUR"
                        }
                    ], 
                    "payeeparty": "http://example.com/cv/party/epa"
                }
            ], 
            "target": "urn:newsml:example.com:20090101:120111-999-000013"
        }
    ], 
    "policyid": "http://example.com/RightsML/policy/2c1b09db7cd80b63b9107ba5ccc5b93c", 
    "policytype": "http://www.w3.org/ns/odrl/2/Set"
}"""

		simple_payee_xml="""<o:Policy xmlns:o="http://www.w3.org/ns/odrl/2/" uid="http://example.com/RightsML/policy/2c1b09db7cd80b63b9107ba5ccc5b93c" type="http://www.w3.org/ns/odrl/2/Set">
  <o:permission>
    <o:asset uid="urn:newsml:example.com:20090101:120111-999-000013" relation="http://www.w3.org/ns/odrl/2/target"/>
    <o:action name="http://www.w3.org/ns/odrl/2/print"/>
    <o:party function="http://www.w3.org/ns/odrl/2/assigner" uid="http://example.com/cv/party/epa"/>
    <o:party function="http://www.w3.org/ns/odrl/2/assignee" uid="http://example.com/cv/policy/group/epapartners"/>
    <o:duty>
      <o:action name="http://www.w3.org/ns/odrl/2/pay"/>
      <o:constraint name="http://www.w3.org/ns/odrl/2/payAmount" operator="http://www.w3.org/ns/odrl/2/eq" rightOperand="100.00" unit="http://cvx.iptc.org/iso4217a/EUR"/>
      <o:party function="http://www.w3.org/ns/odrl/2/payeeParty" uid="http://example.com/cv/party/epa"/>
    </o:duty>
  </o:permission>
</o:Policy>"""

		payee_json = self.odrl_factory.xml2json(simple_payee_xml)

		self.assertEqual(payee_json, simple_payee_json)


	def test_json_to_geodate_xml(self):
		simple_geodate_json="""{
    "permissions": [
        {
            "action": "http://www.w3.org/ns/odrl/2/use", 
            "assignee": "http://example.com/cv/policy/group/epapartners", 
            "assigner": "http://example.com/cv/party/epa", 
            "constraints": [
                {
                    "name": "http://www.w3.org/ns/odrl/2/spatial", 
                    "operator": "http://www.w3.org/ns/odrl/2/neq", 
                    "rightoperand": "http://cvx.iptc.org/iso3166-1a3/GBR"
                }, 
                {
                    "name": "http://www.w3.org/ns/odrl/2/dateTime", 
                    "operator": "http://www.w3.org/ns/odrl/2/lt", 
                    "rightoperand": "2013-06-15", 
                    "rightoperanddatatype": "xs:dateTime"
                }
            ], 
            "target": "urn:newsml:example.com:20090101:120111-999-000013"
        }
    ], 
    "policyid": "http://example.com/RightsML/policy/04f4bc3ad8f037a8ffb15186005ef672", 
    "policytype": "http://www.w3.org/ns/odrl/2/Set"
}"""

		simple_geodate_xml="""<o:Policy xmlns:o="http://www.w3.org/ns/odrl/2/" uid="http://example.com/RightsML/policy/04f4bc3ad8f037a8ffb15186005ef672" type="http://www.w3.org/ns/odrl/2/Set">
  <o:permission>
    <o:asset uid="urn:newsml:example.com:20090101:120111-999-000013" relation="http://www.w3.org/ns/odrl/2/target"/>
    <o:action name="http://www.w3.org/ns/odrl/2/use"/>
    <o:constraint name="http://www.w3.org/ns/odrl/2/spatial" operator="http://www.w3.org/ns/odrl/2/neq" rightOperand="http://cvx.iptc.org/iso3166-1a3/GBR"/>
    <o:constraint name="http://www.w3.org/ns/odrl/2/dateTime" operator="http://www.w3.org/ns/odrl/2/lt" rightOperand="2013-06-15" dataType="xs:dateTime"/>
    <o:party function="http://www.w3.org/ns/odrl/2/assigner" uid="http://example.com/cv/party/epa"/>
    <o:party function="http://www.w3.org/ns/odrl/2/assignee" uid="http://example.com/cv/policy/group/epapartners"/>
  </o:permission>
</o:Policy>"""


		geodate_json = self.odrl_factory.xml2json(simple_geodate_xml)

		self.assertEqual(geodate_json, simple_geodate_json)


class ProfileTest(unittest.TestCase):

	def setUp(self):
		self.license = odrl()

		jsonfile =  open("ODRL21.json")
		odrlschema = json.load(jsonfile)
		self.odrlvalidator = jsonschema.Draft4Validator(odrlschema)

	def tearDown(self):
		pass

	def test_json_profile(self):
		self.license.odrl['policyprofile'] = "http://www.w3.org/community/odrl/work/cc/"
		self.license.odrl['policytype'] = "http://www.w3.org/ns/odrl/2/offer"
		self.license.odrl['permissions'] = [{'target' : "http://www.example.com/assets/1234567",
			'assigner' : "http://example.com/cv/party/epa",
			'assignee' : "http://example.com/cv/policy/group/epapartners",
			'action' : "http://www.w3.org/community/odrl/work/cc/Sharing" }]
		hashedparams = hashlib.md5(self.license.json())
		self.license.odrl['policyid'] = 'http://example.com/cc/policy/' + hashedparams.hexdigest()

		profilelicense_json = self.license.json()

		self.assertIn("http://www.w3.org/community/odrl/work/cc/Sharing", profilelicense_json)
		self.assertIn("profile", profilelicense_json)
		self.assertIn("epa", profilelicense_json)

	def test_xml_profile(self):
		self.license.odrl['policyprofile'] = "http://www.iptc.org/std/RightsML/2011-10-07/"
		self.license.odrl['policytype'] = "http://www.w3.org/ns/odrl/2/set"
		self.license.odrl['permissions'] = [{'target' : "http://www.example.com/assets/1234567",
			'assigner' : "http://example.com/cv/party/epa",
			'assignee' : "http://example.com/cv/policy/group/epapartners",
			'action' : "http://www.w3.org/ns/odrl/2/use" }]
		hashedparams = hashlib.md5(self.license.json())
		self.license.odrl['policyid'] = 'http://example.com/RightsML/policy/' + hashedparams.hexdigest()

		profilelicense_xml = self.license.xml()

		self.assertIn("profile", profilelicense_xml)
		self.assertIn("http://www.iptc.org/std/RightsML/2011-10-07/", profilelicense_xml)
		self.assertIn("epa", profilelicense_xml)

class ParseJSONODRLTest(unittest.TestCase):
	def setUp(self):
		self.odrl_factory = odrl()

	def tearDown(self):
		pass

	def test_parse_json(self):
		test_json = """
		{
		    "permissions": [
			{
			    "action": "http://www.w3.org/ns/odrl/2/print", 
			    "assignee": "http://example.com/cv/policy/group/epapartners", 
			    "assigner": "http://example.com/cv/party/epa", 
			    "target": "urn:newsml:example.com:20090101:120111-999-000013"
			}
		    ], 
		    "policyid": "http://example.com/RightsML/policy/fc5ac66f826c0f850faa91262b64ffdc", 
		    "policyprofile": "http://www.iptc.org/std/RightsML/", 
		    "policytype": "http://www.w3.org/ns/odrl/2/Set"
		}
		"""
		test_xml ='<o:Policy xmlns:o="http://www.w3.org/ns/odrl/2/" uid="http://example.com/RightsML/policy/fc5ac66f826c0f850faa91262b64ffdc" type="http://www.w3.org/ns/odrl/2/Set" profile="http://www.iptc.org/std/RightsML/">\n  <o:permission>\n    <o:asset uid="urn:newsml:example.com:20090101:120111-999-000013" relation="http://www.w3.org/ns/odrl/2/target"/>\n    <o:action name="http://www.w3.org/ns/odrl/2/print"/>\n    <o:party function="http://www.w3.org/ns/odrl/2/assigner" uid="http://example.com/cv/party/epa"/>\n    <o:party function="http://www.w3.org/ns/odrl/2/assignee" uid="http://example.com/cv/policy/group/epapartners"/>\n  </o:permission>\n</o:Policy>\n'
		self.odrl_factory.from_json(test_json)
		xml_license = self.odrl_factory.xml()
		self.assertEqual(xml_license, test_xml)

class JSONtoPykeTest(unittest.TestCase):
 
	def setUp(self):
		self.odrl_factory = odrl()

	def tearDown(self):
		pass
 
	def test_json_pyke(self):
		test_json = """
		{
		    "permissions": [
			{
			    "action": "http://www.w3.org/ns/odrl/2/print", 
			    "assignee": "http://example.com/cv/policy/group/epapartners", 
			    "assigner": "http://example.com/cv/party/epa", 
			    "target": "urn:newsml:example.com:20090101:120111-999-000013"
			}
		    ], 
		    "policyid": "http://example.com/RightsML/policy/fc5ac66f826c0f850faa91262b64ffdc", 
		    "policyprofile": "http://www.iptc.org/std/RightsML/", 
		    "policytype": "http://www.w3.org/ns/odrl/2/Set"
		}
		"""

		expected_pyke = """permission(policy, http://example.com/cv/party/epa, http://example.com/cv/policy/group/epapartners, http://www.w3.org/ns/odrl/2/print, (), ())"""

		self.odrl_factory.from_json(test_json)
		pyke_license = self.odrl_factory.pyke()
		self.assertEqual(pyke_license, expected_pyke)

if __name__ == '__main__':
	unittest.main()
