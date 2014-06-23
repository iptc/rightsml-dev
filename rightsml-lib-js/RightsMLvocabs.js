var RightsML;
(function (RightsML) {
    // development timestamp: 2014-06-23
    // development by Michael W. Steidl (www.linkedin.com/in/michaelwsteidl)
    // Constant values:
    RightsML.nsUri = "http://iptc.org/std/RightsML/2011-10-07/";

    var Actions = (function () {
        function Actions() {
        }
        Actions.archive = RightsML.nsUri + "archive";
        Actions.copy = RightsML.nsUri + "copy";
        Actions.distribute = RightsML.nsUri + "distribute";
        Actions.removeFromService = RightsML.nsUri + "removeFromService";
        return Actions;
    })();
    RightsML.Actions = Actions;

    var Constraints = (function () {
        function Constraints() {
        }
        Constraints.actionRequestReceived = RightsML.nsUri + "actionRequestReceived";
        Constraints.requestedActionsPerformed = RightsML.nsUri + "requestedActionsPerformed";
        return Constraints;
    })();
    RightsML.Constraints = Constraints;

    var RightOperands = (function () {
        function RightOperands() {
        }
        RightOperands.requestReceivedDateTime = RightsML.nsUri + "requestReceivedDateTime";
        RightOperands.serviceDevelopment = RightsML.nsUri + "serviceDevelopment";
        RightOperands.serviceDemonstration = RightsML.nsUri + "serviceDemonstration";
        RightOperands.serviceTesting = RightsML.nsUri + "serviceTesting";
        return RightOperands;
    })();
    RightsML.RightOperands = RightOperands;
})(RightsML || (RightsML = {}));
//# sourceMappingURL=RightsMLvocabs.js.map
