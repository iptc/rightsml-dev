var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="ODRLclasses.ts"/>
/// <reference path="RightsMLvocabs.ts"/>
/**
* development timestamp: 2014-06-23
* development by Michael W. Steidl (www.linkedin.com/in/michaelwsteidl)
*
* This module provides all ODRL classes complying to the RightsML profile
*
*/
var RightsML;
(function (RightsML) {
    var Policy = (function (_super) {
        __extends(Policy, _super);
        function Policy(pUid, pType) {
            _super.call(this, pUid, pType);
            this.profile = RightsML.nsUri;
        }
        return Policy;
    })(Odrl.Policy);
    RightsML.Policy = Policy;
})(RightsML || (RightsML = {}));
//# sourceMappingURL=RightsMLclasses.js.map
