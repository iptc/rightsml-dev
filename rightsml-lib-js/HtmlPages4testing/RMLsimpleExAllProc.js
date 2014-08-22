/// <reference path="../ODRLclasses.ts"/>
/// <reference path="../ODRLvocabs.ts"/>
/// <reference path="../RightsMLvocabs.ts"/>
/// <reference path="./scripts/vkbeautify.d.ts"/>
/**
* development timestamp: 2014-06-24
* development by Michael W. Steidl (www.linkedin.com/in/michaelwsteidl)
*
* This module provides functions for processing the RightsML Simple Examples HTML pages
*
*/
// the function for the RMLsimpleExampleGeo form:
function processFormSimpleExGeo() {
    var policyGUID = document.forms["relinput1"]["policyGUID"].value;
    var policy1 = new Odrl.Policy(policyGUID, "set");
    var perm1 = new Odrl.Permission();
    var action = getRBvalueSimpleEx("relinput1", "grAction");
    var targetAsset = document.forms["relinput1"]["targetassetGUID"].value;
    var constraintoperator = document.forms["relinput1"]["constraintoperator"].value;
    var constrainttarget = document.forms["relinput1"]["constrainttarget"].value;
    var assigner = document.forms["relinput1"]["assignerParty"].value;
    var assignee = document.forms["relinput1"]["assigneeParty"].value;
    perm1.setAction(action).addAsset(targetAsset, Odrl.AssetRelationsCV.target).addConstraint(Odrl.ConstraintsCV.spatial, constraintoperator, constrainttarget, "", "", "").addParty(assigner, Odrl.PartyRolesCV.assigner, Odrl.PartyRoleScopesCV.individual).addParty(assignee, Odrl.PartyRolesCV.assignee, Odrl.PartyRoleScopesCV.individual);

    policy1.addPermission(perm1);

    // make the object ready for display: in XML first
    var xmlStr = policy1.serializeXml();
    xmlStr = vkbeautify.xml(xmlStr);
    xmlStr = xmlStr.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // xmlStr = xmlStr.replace(/>/g, "&gt;");
    var outStr = "<pre>" + xmlStr + "</pre>";
    var xel = document.getElementById('content1');
    xel.innerHTML = "<h2>Example in XML</h2>" + outStr;

    // ... and now in JSON
    var jel = document.getElementById('content2');
    outStr = policy1.serializeJson();
    jel.innerHTML = "<h2>Example in JSON</h2><pre>" + outStr + "</pre>";
}

// the function for the RMLsimpleExampleTimePeriod form:
function processFormSimpleExTimePeriod() {
    var policyGUID = document.forms["relinput1"]["policyGUID"].value;
    var policy1 = new Odrl.Policy(policyGUID, "set");
    var perm1 = new Odrl.Permission();
    var action = getListValueSimpleEx("relinput1", "grAction");
    var targetAsset = document.forms["relinput1"]["targetassetGUID"].value;
    var constraintoperator = getListValueSimpleEx("relinput1", "constraintoperator");
    var constrainttarget = document.forms["relinput1"]["constrainttarget"].value;
    var assigner = document.forms["relinput1"]["assignerParty"].value;
    var assignee = document.forms["relinput1"]["assigneeParty"].value;
    perm1.setAction(action).addAsset(targetAsset, Odrl.AssetRelationsCV.target).addConstraint(Odrl.ConstraintsCV.dateTime, constraintoperator, constrainttarget, "", "", "").addParty(assigner, Odrl.PartyRolesCV.assigner, Odrl.PartyRoleScopesCV.individual).addParty(assignee, Odrl.PartyRolesCV.assignee, Odrl.PartyRoleScopesCV.individual);

    policy1.addPermission(perm1);

    // make the object ready for display: in XML first
    var xmlStr = policy1.serializeXml();
    xmlStr = vkbeautify.xml(xmlStr);
    xmlStr = xmlStr.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // xmlStr = xmlStr.replace(/>/g, "&gt;");
    var outStr = "<pre>" + xmlStr + "</pre>";
    var xel = document.getElementById('content1');
    xel.innerHTML = "<h2>Example in XML</h2>" + outStr;

    // ... and now in JSON
    var jel = document.getElementById('content2');
    outStr = policy1.serializeJson();
    jel.innerHTML = "<h2>Example in JSON</h2><pre>" + outStr + "</pre>";
}

// ** Utilities
function getRBvalueSimpleEx(form, rbgroup) {
    var rbvalue = "";
    var len = document.forms[form][rbgroup].length;
    var i;
    for (i = 0; i < len; i++) {
        if (document.forms[form][rbgroup][i].checked) {
            rbvalue = document.forms[form][rbgroup][i].value;
            break;
        }
    }
    return rbvalue;
}

function getListValueSimpleEx(form, list) {
    var listvalue = "";
    var selIndex = document.forms[form][list].selectedIndex;
    listvalue = document.forms[form][list].options[selIndex].value;
    return listvalue;
}
//# sourceMappingURL=RMLsimpleExAllProc.js.map
