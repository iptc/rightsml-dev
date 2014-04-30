#!/usr/bin/python

from licensed import mklicense
 
licenseFactory = mklicense(target="urn:newsml:example.com:20090101:120111-999-000013", 
	assigner="http://example.com/cv/party/epa",
	assignee="http://example.com/cv/policy/group/epapartners")

geolicense = licenseFactory.simpleGeographic(geography="http://cvx.iptc.org/iso3166-1a3/DEU")

geolicense_xml = geolicense.xml()

assert "DEU" in geolicense_xml
