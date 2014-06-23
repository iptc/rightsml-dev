/// <reference path="ODRLclasses.ts"/>
var Odrl;
(function (Odrl) {
    // development timestamp: 2014-06-23
    // development by Michael W. Steidl (www.linkedin.com/in/michaelwsteidl)
    Odrl.nsVocabUri = "http://www.w3.org/ns/odrl/2/";
    var Actions = (function () {
        function Actions() {
        }
        Actions.acceptTracking = Odrl.nsVocabUri + "acceptTracking";
        Actions.aggregate = Odrl.nsVocabUri + "aggregate";
        Actions.annotate = Odrl.nsVocabUri + "annotate";
        Actions.anonymize = Odrl.nsVocabUri + "anonymize";
        Actions.appendTo = Odrl.nsVocabUri + "appendTo";
        Actions.archive = Odrl.nsVocabUri + "archive";
        Actions.attribute = Odrl.nsVocabUri + "attribute";
        Actions.concurrentUse = Odrl.nsVocabUri + "concurrentUse";
        Actions.deletee = Odrl.nsVocabUri + "delete";
        Actions.derive = Odrl.nsVocabUri + "derive";
        Actions.digitize = Odrl.nsVocabUri + "digitize";
        Actions.display = Odrl.nsVocabUri + "display";
        Actions.distribute = Odrl.nsVocabUri + "distribute";
        Actions.ensureExclusivity = Odrl.nsVocabUri + "ensureExclusivity";
        Actions.execute = Odrl.nsVocabUri + "execute";
        Actions.extract = Odrl.nsVocabUri + "extract";
        Actions.give = Odrl.nsVocabUri + "give";
        Actions.include = Odrl.nsVocabUri + "include";
        Actions.index = Odrl.nsVocabUri + "index";
        Actions.inform = Odrl.nsVocabUri + "inform";
        Actions.install = Odrl.nsVocabUri + "install";
        Actions.lease = Odrl.nsVocabUri + "lease";
        Actions.lend = Odrl.nsVocabUri + "lend";
        Actions.move = Odrl.nsVocabUri + "move";
        Actions.nextPolicy = Odrl.nsVocabUri + "nextPolicy";
        Actions.obtainConsent = Odrl.nsVocabUri + "obtainConsent";
        Actions.pay = Odrl.nsVocabUri + "pay";
        Actions.play = Odrl.nsVocabUri + "play";
        Actions.present = Odrl.nsVocabUri + "present";
        Actions.preview = Odrl.nsVocabUri + "preview";
        Actions.print = Odrl.nsVocabUri + "print";
        Actions.read = Odrl.nsVocabUri + "read";
        Actions.reproduce = Odrl.nsVocabUri + "reproduce";
        Actions.reviewPolicy = Odrl.nsVocabUri + "reviewPolicy";
        Actions.secondaryUse = Odrl.nsVocabUri + "secondaryUse";
        Actions.sell = Odrl.nsVocabUri + "sell";
        Actions.sublicense = Odrl.nsVocabUri + "sublicense";
        Actions.textToSpeech = Odrl.nsVocabUri + "textToSpeech";
        Actions.transfer = Odrl.nsVocabUri + "transfer";
        Actions.transform = Odrl.nsVocabUri + "transform";
        Actions.translate = Odrl.nsVocabUri + "translate";
        Actions.uninstall = Odrl.nsVocabUri + "uninstall";
        Actions.use = Odrl.nsVocabUri + "use";
        Actions.watermark = Odrl.nsVocabUri + "watermark";
        Actions.writeTo = Odrl.nsVocabUri + "writeTo";
        return Actions;
    })();
    Odrl.Actions = Actions;
    var PolicyTypes = (function () {
        function PolicyTypes() {
        }
        PolicyTypes.agreement = Odrl.nsVocabUri + "agreement";
        PolicyTypes.offer = Odrl.nsVocabUri + "offer";
        PolicyTypes.privacy = Odrl.nsVocabUri + "privacy";
        PolicyTypes.request = Odrl.nsVocabUri + "request";
        PolicyTypes.set = Odrl.nsVocabUri + "set";
        PolicyTypes.ticket = Odrl.nsVocabUri + "ticket";
        return PolicyTypes;
    })();
    Odrl.PolicyTypes = PolicyTypes;
    var Constraints = (function () {
        function Constraints() {
        }
        Constraints.absolutePosition = Odrl.nsVocabUri + "absolutePosition";
        Constraints.absoluteSize = Odrl.nsVocabUri + "absoluteSize";
        Constraints.count = Odrl.nsVocabUri + "count";
        Constraints.dateTime = Odrl.nsVocabUri + "dateTime";
        Constraints.fileFormat = Odrl.nsVocabUri + "fileFormat";
        Constraints.industry = Odrl.nsVocabUri + "industry";
        Constraints.language = Odrl.nsVocabUri + "language";
        Constraints.deliveryChannel = Odrl.nsVocabUri + "deliveryChannel";
        Constraints.elapsedTime = Odrl.nsVocabUri + "elapsedTime";
        Constraints.event = Odrl.nsVocabUri + "media";
        Constraints.meteredTime = Odrl.nsVocabUri + "meteredTime";
        Constraints.payAmount = Odrl.nsVocabUri + "payAmount";
        Constraints.percentage = Odrl.nsVocabUri + "percentage";
        Constraints.product = Odrl.nsVocabUri + "product";
        Constraints.purpose = Odrl.nsVocabUri + "purpose";
        Constraints.recipient = Odrl.nsVocabUri + "recipient";
        Constraints.relativePosition = Odrl.nsVocabUri + "relativePosition";
        Constraints.relativeSize = Odrl.nsVocabUri + "relativeSize";
        Constraints.resolution = Odrl.nsVocabUri + "resolution";
        Constraints.spatial = Odrl.nsVocabUri + "spatial";
        Constraints.timeInterval = Odrl.nsVocabUri + "event";
        Constraints.systemDevice = Odrl.nsVocabUri + "systemDevice";
        Constraints.version = Odrl.nsVocabUri + "version";
        Constraints.virtualLocation = Odrl.nsVocabUri + "virtualLocation";
        return Constraints;
    })();
    Odrl.Constraints = Constraints;
    var ConstrOperators = (function () {
        function ConstrOperators() {
        }
        ConstrOperators.eq = Odrl.nsVocabUri + "eq";
        ConstrOperators.gt = Odrl.nsVocabUri + "gt";
        ConstrOperators.gteq = Odrl.nsVocabUri + "gteq";
        ConstrOperators.hasPart = Odrl.nsVocabUri + "hasPart";
        ConstrOperators.isA = Odrl.nsVocabUri + "isA";
        ConstrOperators.isAllOf = Odrl.nsVocabUri + "isAllOf";
        ConstrOperators.isAnyOf = Odrl.nsVocabUri + "isAnyOf";
        ConstrOperators.isNoneOf = Odrl.nsVocabUri + "isNoneOf";
        ConstrOperators.isPartOf = Odrl.nsVocabUri + "isPartOf";
        ConstrOperators.lt = Odrl.nsVocabUri + "lt";
        ConstrOperators.lteq = Odrl.nsVocabUri + "lteq";
        ConstrOperators.neq = Odrl.nsVocabUri + "neq";
        return ConstrOperators;
    })();
    Odrl.ConstrOperators = ConstrOperators;
    var PartyRoles = (function () {
        function PartyRoles() {
        }
        PartyRoles.assigner = Odrl.nsVocabUri + "assigner";
        PartyRoles.assignee = Odrl.nsVocabUri + "assignee";
        PartyRoles.attributedParty = Odrl.nsVocabUri + "attributedParty";
        PartyRoles.consentingParty = Odrl.nsVocabUri + "consentingParty";
        PartyRoles.informedParty = Odrl.nsVocabUri + "informedParty";
        PartyRoles.payeeParty = Odrl.nsVocabUri + "payeeParty";
        PartyRoles.trackingParty = Odrl.nsVocabUri + "trackingParty";
        return PartyRoles;
    })();
    Odrl.PartyRoles = PartyRoles;
    var PartyRoleScopes = (function () {
        function PartyRoleScopes() {
        }
        PartyRoleScopes.individual = Odrl.nsVocabUri + "individual";
        PartyRoleScopes.group = Odrl.nsVocabUri + "group";
        PartyRoleScopes.all = Odrl.nsVocabUri + "all";
        PartyRoleScopes.allConnections = Odrl.nsVocabUri + "allConnections";
        PartyRoleScopes.all2ndConnections = Odrl.nsVocabUri + "all2ndConnections";
        PartyRoleScopes.allGroups = Odrl.nsVocabUri + "allGroups";
        return PartyRoleScopes;
    })();
    Odrl.PartyRoleScopes = PartyRoleScopes;
    var AssetRelations = (function () {
        function AssetRelations() {
        }
        AssetRelations.target = Odrl.nsVocabUri + "target";
        AssetRelations.output = Odrl.nsVocabUri + "output";
        return AssetRelations;
    })();
    Odrl.AssetRelations = AssetRelations;
})(Odrl || (Odrl = {}));
//# sourceMappingURL=ODRLvocabs.js.map
