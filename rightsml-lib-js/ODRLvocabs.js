/// <reference path="ODRLclasses.ts"/>
/**
* This module provides each currently defined ODRL Controlled Vocabulary
* as a class.
*
* @author Copyright Michael W. Steidl (www.linkedin.com/in/michaelwsteidl)
* Published under MIT license (see http://www.opensource.org/licenses/MIT)
* development timestamp: 2014-06-25
*/
var Odrl;
(function (Odrl) {
    Odrl.nsVocabUri = "http://www.w3.org/ns/odrl/2/";
    var ActionsCV = (function () {
        function ActionsCV() {
        }
        ActionsCV.acceptTracking = Odrl.nsVocabUri + "acceptTracking";
        ActionsCV.aggregate = Odrl.nsVocabUri + "aggregate";
        ActionsCV.annotate = Odrl.nsVocabUri + "annotate";
        ActionsCV.anonymize = Odrl.nsVocabUri + "anonymize";
        ActionsCV.appendTo = Odrl.nsVocabUri + "appendTo";
        ActionsCV.archive = Odrl.nsVocabUri + "archive";
        ActionsCV.attribute = Odrl.nsVocabUri + "attribute";
        ActionsCV.concurrentUse = Odrl.nsVocabUri + "concurrentUse";
        ActionsCV.deletee = Odrl.nsVocabUri + "delete";
        ActionsCV.derive = Odrl.nsVocabUri + "derive";
        ActionsCV.digitize = Odrl.nsVocabUri + "digitize";
        ActionsCV.display = Odrl.nsVocabUri + "display";
        ActionsCV.distribute = Odrl.nsVocabUri + "distribute";
        ActionsCV.ensureExclusivity = Odrl.nsVocabUri + "ensureExclusivity";
        ActionsCV.execute = Odrl.nsVocabUri + "execute";
        ActionsCV.extract = Odrl.nsVocabUri + "extract";
        ActionsCV.give = Odrl.nsVocabUri + "give";
        ActionsCV.include = Odrl.nsVocabUri + "include";
        ActionsCV.index = Odrl.nsVocabUri + "index";
        ActionsCV.inform = Odrl.nsVocabUri + "inform";
        ActionsCV.install = Odrl.nsVocabUri + "install";
        ActionsCV.lease = Odrl.nsVocabUri + "lease";
        ActionsCV.lend = Odrl.nsVocabUri + "lend";
        ActionsCV.move = Odrl.nsVocabUri + "move";
        ActionsCV.nextPolicy = Odrl.nsVocabUri + "nextPolicy";
        ActionsCV.obtainConsent = Odrl.nsVocabUri + "obtainConsent";
        ActionsCV.pay = Odrl.nsVocabUri + "pay";
        ActionsCV.play = Odrl.nsVocabUri + "play";
        ActionsCV.present = Odrl.nsVocabUri + "present";
        ActionsCV.preview = Odrl.nsVocabUri + "preview";
        ActionsCV.print = Odrl.nsVocabUri + "print";
        ActionsCV.read = Odrl.nsVocabUri + "read";
        ActionsCV.reproduce = Odrl.nsVocabUri + "reproduce";
        ActionsCV.reviewPolicy = Odrl.nsVocabUri + "reviewPolicy";
        ActionsCV.secondaryUse = Odrl.nsVocabUri + "secondaryUse";
        ActionsCV.sell = Odrl.nsVocabUri + "sell";
        ActionsCV.sublicense = Odrl.nsVocabUri + "sublicense";
        ActionsCV.textToSpeech = Odrl.nsVocabUri + "textToSpeech";
        ActionsCV.transfer = Odrl.nsVocabUri + "transfer";
        ActionsCV.transform = Odrl.nsVocabUri + "transform";
        ActionsCV.translate = Odrl.nsVocabUri + "translate";
        ActionsCV.uninstall = Odrl.nsVocabUri + "uninstall";
        ActionsCV.use = Odrl.nsVocabUri + "use";
        ActionsCV.watermark = Odrl.nsVocabUri + "watermark";
        ActionsCV.writeTo = Odrl.nsVocabUri + "writeTo";
        return ActionsCV;
    })();
    Odrl.ActionsCV = ActionsCV;
    var PolicyTypesCV = (function () {
        function PolicyTypesCV() {
        }
        PolicyTypesCV.agreement = Odrl.nsVocabUri + "agreement";
        PolicyTypesCV.offer = Odrl.nsVocabUri + "offer";
        PolicyTypesCV.privacy = Odrl.nsVocabUri + "privacy";
        PolicyTypesCV.request = Odrl.nsVocabUri + "request";
        PolicyTypesCV.set = Odrl.nsVocabUri + "set";
        PolicyTypesCV.ticket = Odrl.nsVocabUri + "ticket";
        return PolicyTypesCV;
    })();
    Odrl.PolicyTypesCV = PolicyTypesCV;
    var ConstraintsCV = (function () {
        function ConstraintsCV() {
        }
        ConstraintsCV.absolutePosition = Odrl.nsVocabUri + "absolutePosition";
        ConstraintsCV.absoluteSize = Odrl.nsVocabUri + "absoluteSize";
        ConstraintsCV.count = Odrl.nsVocabUri + "count";
        ConstraintsCV.dateTime = Odrl.nsVocabUri + "dateTime";
        ConstraintsCV.fileFormat = Odrl.nsVocabUri + "fileFormat";
        ConstraintsCV.industry = Odrl.nsVocabUri + "industry";
        ConstraintsCV.language = Odrl.nsVocabUri + "language";
        ConstraintsCV.deliveryChannel = Odrl.nsVocabUri + "deliveryChannel";
        ConstraintsCV.elapsedTime = Odrl.nsVocabUri + "elapsedTime";
        ConstraintsCV.event = Odrl.nsVocabUri + "media";
        ConstraintsCV.meteredTime = Odrl.nsVocabUri + "meteredTime";
        ConstraintsCV.payAmount = Odrl.nsVocabUri + "payAmount";
        ConstraintsCV.percentage = Odrl.nsVocabUri + "percentage";
        ConstraintsCV.product = Odrl.nsVocabUri + "product";
        ConstraintsCV.purpose = Odrl.nsVocabUri + "purpose";
        ConstraintsCV.recipient = Odrl.nsVocabUri + "recipient";
        ConstraintsCV.relativePosition = Odrl.nsVocabUri + "relativePosition";
        ConstraintsCV.relativeSize = Odrl.nsVocabUri + "relativeSize";
        ConstraintsCV.resolution = Odrl.nsVocabUri + "resolution";
        ConstraintsCV.spatial = Odrl.nsVocabUri + "spatial";
        ConstraintsCV.timeInterval = Odrl.nsVocabUri + "event";
        ConstraintsCV.systemDevice = Odrl.nsVocabUri + "systemDevice";
        ConstraintsCV.version = Odrl.nsVocabUri + "version";
        ConstraintsCV.virtualLocation = Odrl.nsVocabUri + "virtualLocation";
        return ConstraintsCV;
    })();
    Odrl.ConstraintsCV = ConstraintsCV;
    var ConstrOperatorsCV = (function () {
        function ConstrOperatorsCV() {
        }
        ConstrOperatorsCV.eq = Odrl.nsVocabUri + "eq";
        ConstrOperatorsCV.gt = Odrl.nsVocabUri + "gt";
        ConstrOperatorsCV.gteq = Odrl.nsVocabUri + "gteq";
        ConstrOperatorsCV.hasPart = Odrl.nsVocabUri + "hasPart";
        ConstrOperatorsCV.isA = Odrl.nsVocabUri + "isA";
        ConstrOperatorsCV.isAllOf = Odrl.nsVocabUri + "isAllOf";
        ConstrOperatorsCV.isAnyOf = Odrl.nsVocabUri + "isAnyOf";
        ConstrOperatorsCV.isNoneOf = Odrl.nsVocabUri + "isNoneOf";
        ConstrOperatorsCV.isPartOf = Odrl.nsVocabUri + "isPartOf";
        ConstrOperatorsCV.lt = Odrl.nsVocabUri + "lt";
        ConstrOperatorsCV.lteq = Odrl.nsVocabUri + "lteq";
        ConstrOperatorsCV.neq = Odrl.nsVocabUri + "neq";
        return ConstrOperatorsCV;
    })();
    Odrl.ConstrOperatorsCV = ConstrOperatorsCV;
    var PartyRolesCV = (function () {
        function PartyRolesCV() {
        }
        PartyRolesCV.assigner = Odrl.nsVocabUri + "assigner";
        PartyRolesCV.assignee = Odrl.nsVocabUri + "assignee";
        PartyRolesCV.attributedParty = Odrl.nsVocabUri + "attributedParty";
        PartyRolesCV.consentingParty = Odrl.nsVocabUri + "consentingParty";
        PartyRolesCV.informedParty = Odrl.nsVocabUri + "informedParty";
        PartyRolesCV.payeeParty = Odrl.nsVocabUri + "payeeParty";
        PartyRolesCV.trackingParty = Odrl.nsVocabUri + "trackingParty";
        return PartyRolesCV;
    })();
    Odrl.PartyRolesCV = PartyRolesCV;
    var PartyRoleScopesCV = (function () {
        function PartyRoleScopesCV() {
        }
        PartyRoleScopesCV.individual = Odrl.nsVocabUri + "individual";
        PartyRoleScopesCV.group = Odrl.nsVocabUri + "group";
        PartyRoleScopesCV.all = Odrl.nsVocabUri + "all";
        PartyRoleScopesCV.allConnections = Odrl.nsVocabUri + "allConnections";
        PartyRoleScopesCV.all2ndConnections = Odrl.nsVocabUri + "all2ndConnections";
        PartyRoleScopesCV.allGroups = Odrl.nsVocabUri + "allGroups";
        return PartyRoleScopesCV;
    })();
    Odrl.PartyRoleScopesCV = PartyRoleScopesCV;
    var AssetRelationsCV = (function () {
        function AssetRelationsCV() {
        }
        AssetRelationsCV.target = Odrl.nsVocabUri + "target";
        AssetRelationsCV.output = Odrl.nsVocabUri + "output";
        return AssetRelationsCV;
    })();
    Odrl.AssetRelationsCV = AssetRelationsCV;
})(Odrl || (Odrl = {}));
//# sourceMappingURL=ODRLvocabs.js.map
