/**
* This file of the module provides all classes of the ODRL data model
*
* @module: ODRL
* @author Copyright Michael W. Steidl (www.linkedin.com/in/michaelwsteidl)
* Published under MIT license (see http://www.opensource.org/licenses/MIT)
* development timestamp: 2014-06-23
*/
var Odrl;
(function (Odrl) {
    // Constant values:
    Odrl.nsUri = "http://www.w3.org/ns/odrl/2/";
    Odrl.nsPrefix = "o";

    var OdrlInJson;

    // The classes:
    // ****************************************************
    /**
    * Class for the Asset of the ODRL Core Model
    * @class Asset
    * @constructor
    * @param {String} uid The Unique Identifier of the Asset
    * @param {String} relation The relation of the asset to the policy
    */
    var Asset = (function () {
        function Asset(uid, relation) {
            this.uid = uid;
            this.relation = relation;
        }
        Asset.prototype.validationResult = function () {
            var valResult = "";
            if (this.uid.length < 1) {
                valResult = "!! Asset: the uid is missing\n";
            }
            return valResult;
        };

        Asset.prototype.serializeXml = function (serStrIn) {
            return serStrIn + "<asset uid=\"" + this.uid + "\" relation=\"" + this.relation + "\"/>";
        };
        return Asset;
    })();
    Odrl.Asset = Asset;

    // ****************************************************
    /**
    * Class for the Action of the ODRL Core Model
    * @class Action
    * @constructor
    * @param {String} name The identifing name of the Action
    */
    var Action = (function () {
        function Action(name) {
            this.name = name;
        }
        Action.prototype.serializeXml = function (serStrIn) {
            return serStrIn + "<action name=\"" + this.name + "\"/>";
        };
        return Action;
    })();
    Odrl.Action = Action;

    // ****************************************************
    /**
    * Class for the Constraint of the ODRL Core Model
    * @class Constraint
    * @constructor
    * @param {String} name The identifing name of the Constraint
    * @param {String} operator The identifyer of the operator
    * @param {String} rightOperand The identifyer of the right operand
    * @param {String} dataType The identifyer of the data type of the right operand
    * @param {String} unit The identifyer of the unit of the right operand
    * @param {String} status The identifyer of the status
    */
    var Constraint = (function () {
        function Constraint(name, operator, rightOperand, dataType, unit, status) {
            this.name = name;
            this.operator = operator;
            this.rightOperand = rightOperand;
            this.dataType = dataType;
            this.unit = unit;
            this.status = status;
        }
        Constraint.prototype.serializeXml = function (serStrIn) {
            var serStrOut = serStrIn + "<constraint name=\"" + this.name + "\"";
            if (this.operator !== undefined && this.operator != "") {
                serStrOut += " operator=\"" + this.operator + "\"";
            }
            if (this.rightOperand !== undefined && this.rightOperand != "") {
                serStrOut += " rightOperand=\"" + this.rightOperand + "\"";
            }
            if (this.dataType !== undefined && this.dataType != "") {
                serStrOut += " dataType=\"" + this.dataType + "\"";
            }
            if (this.unit !== undefined && this.unit != "") {
                serStrOut += " unit=\"" + this.unit + "\"";
            }
            if (this.status !== undefined && this.status != "") {
                serStrOut += " status=\"" + this.status + "\"";
            }
            serStrOut += "/>";
            return serStrOut;
        };
        return Constraint;
    })();
    Odrl.Constraint = Constraint;

    // ****************************************************
    /**
    * Class for the Party of the ODRL Core Model
    * @class Party
    * @constructor
    * @param {String} uid The Unique Identifier of the Party
    * @param {String} pfunction The identifier of the functional role this party takes
    * @param {String} scope The scope of the party
    */
    var Party = (function () {
        function Party(uid, pfunction, scope) {
            this.uid = uid;
            this.pfunction = pfunction;
            this.scope = scope;
        }
        Party.prototype.serializeXml = function (serStrIn) {
            var serStrOut = serStrIn + "<party uid=\"" + this.uid + "\"";
            if (this.pfunction !== undefined && this.pfunction != "") {
                serStrOut += " function=\"" + this.pfunction + "\"";
            }
            if (this.scope !== undefined && this.scope != "") {
                serStrOut += " scope=\"" + this.scope + "\"";
            }
            serStrOut += "/>";
            return serStrOut;
        };
        return Party;
    })();
    Odrl.Party = Party;

    // ****************************************************
    /**
    * Class for the Duty of the ODRL Core Model
    * @class Duty
    * @constructor
    */
    var Duty = (function () {
        function Duty() {
            this.uid = null;
            this.assets = [];
            this.constraints = [];
            this.parties = [];
        }
        /**
        * The method for setting the unique identifier of the Duty
        * @method setUid
        * @param {String} uid The unique identifier of the Duty
        */
        Duty.prototype.setUid = function (uid) {
            this.uid = uid;
            return this;
        };

        /**
        * The method for setting the action of the Duty
        * @method setAction
        * @param {String} actionname The identifier of the action
        */
        Duty.prototype.setAction = function (actionname) {
            this.action = new Action(actionname);
            return this;
        };

        /**
        * The method for adding an asset to the Duty
        * @method addAsset
        * @param {String} uid The unique identifier of the asset
        * @param {String} relation The relation of the asset to the Duty.
        */
        Duty.prototype.addAsset = function (uid, relation) {
            var newAsset = new Asset(uid, relation);
            this.assets.push(newAsset);
            return this;
        };

        /**
        * The method for adding a constraint to the Duty
        * @method addConstraint
        * @param {String} name The identifing name of the Constraint
        * @param {String} operator The identifyer of the operator
        * @param {String} rightOperand The identifyer of the right operand
        * @param {String} dataType The identifyer of the data type of the right operand
        * @param {String} unit The identifyer of the unit of the right operand
        * @param {String} status The identifyer of the status
        */
        Duty.prototype.addConstraint = function (name, operator, rightOperand, dataType, unit, status) {
            var newConstraint = new Constraint(name, operator, rightOperand, dataType, unit, status);
            this.constraints.push(newConstraint);
            return this;
        };

        /**
        * The method for adding a party to the Duty
        * @method addParty
        * @param {String} uid The Unique Identifier of the Party
        * @param {String} pfunction The identifier of the functional role this party takes
        * @param {String} scope The scope of the party
        */
        Duty.prototype.addParty = function (uid, pfunction, scope) {
            var newParty = new Party(uid, pfunction, scope);
            this.parties.push(newParty);
            return this;
        };

        Duty.prototype.serializeXml = function (serStrIn) {
            var serStrOut = serStrIn;
            if (this.uid != undefined && this.uid != "") {
                serStrOut += "<duty uid=\"" + this.uid + "\" >";
            } else {
                serStrOut += "<duty>";
            }
            var i;
            for (i = 0; i < this.assets.length; i++) {
                serStrOut = this.assets[i].serializeXml(serStrOut);
            }
            if (this.action != undefined) {
                serStrOut = this.action.serializeXml(serStrOut);
            }
            for (i = 0; i < this.constraints.length; i++) {
                serStrOut = this.constraints[i].serializeXml(serStrOut);
            }
            for (i = 0; i < this.parties.length; i++) {
                serStrOut = this.parties[i].serializeXml(serStrOut);
            }
            serStrOut += "</duty>";
            return serStrOut;
        };

        Duty.prototype.buildDutyOdrlInJson = function () {
            var thisD = {};
            var i;
            thisD.action = this.action.name;
            for (i = 0; i < this.assets.length; i++) {
                if (this.assets[i].relation == Odrl.nsUri + "target") {
                    thisD.target = this.assets[i].uid;
                }
                if (this.assets[i].relation == Odrl.nsUri + "output") {
                    thisD.output = this.assets[i].uid;
                }
            }
            if (this.constraints.length > 0) {
                thisD.constraints = [];
                var thisC;
                for (i = 0; i < this.constraints.length; i++) {
                    thisC = {};
                    thisC.name = this.constraints[i].name;
                    thisC.operator = this.constraints[i].operator;
                    thisC.rightoperand = this.constraints[i].rightOperand;
                    if (this.constraints[i].dataType != undefined && this.constraints[i].dataType !== "") {
                        thisC.rightoperanddatatype = this.constraints[i].dataType;
                    }
                    if (this.constraints[i].unit != undefined && this.constraints[i].unit !== "") {
                        thisC.rightoperandunit = this.constraints[i].unit;
                    }
                    if (this.constraints[i].status != undefined && this.constraints[i].status !== "") {
                        thisC.status = this.constraints[i].status;
                    }
                    thisD.constraints.push(thisC);
                }
            }
            for (i = 0; i < this.parties.length; i++) {
                if (this.parties[i].pfunction == Odrl.nsUri + "assigner") {
                    thisD.assigner = this.parties[i].uid;
                }
                if (this.parties[i].pfunction == Odrl.nsUri + "assignee") {
                    thisD.assignee = this.parties[i].uid;
                    if (this.parties[i].scope != "") {
                        thisD.assignee_scope = this.parties[i].scope;
                    }
                }
            }
            return thisD;
        };
        return Duty;
    })();
    Odrl.Duty = Duty;

    // ****************************************************
    /**
    * Class for the Permission of the ODRL Core Model
    * @class Permission
    * @constructor
    */
    var Permission = (function () {
        function Permission() {
            this.action = null;
            this.assets = [];
            this.constraints = [];
            this.parties = [];
            this.duties = [];
        }
        /**
        * The method for setting the action of the Permission
        * @method setAction
        * @param {String} actionname The identifier of the action
        */
        Permission.prototype.setAction = function (actionname) {
            this.action = new Action(actionname);
            return this;
        };

        /**
        * The method for adding an asset to the Permission
        * @method addAsset
        * @param {String} uid The unique identifier of the asset
        * @param {String} relation The relation of the asset to the Duty.
        */
        Permission.prototype.addAsset = function (uid, relation) {
            var newAsset = new Asset(uid, relation);
            this.assets.push(newAsset);
            return this;
        };

        /**
        * The method for adding the required target asset to the Permission
        * @method addTargetAsset
        * @param {String} uid The unique identifier of the asset
        */
        Permission.prototype.addTargetAsset = function (uid) {
            var newAsset = new Asset(uid, Odrl.AssetRelationsCV.target);
            this.assets.push(newAsset);
            return this;
        };

        /**
        * The method for adding a constraint to the Permission
        * @method addConstraint
        * @param {String} name The identifing name of the Constraint
        * @param {String} operator The identifyer of the operator
        * @param {String} rightOperand The identifyer of the right operand
        * @param {String} dataType The identifyer of the data type of the right operand
        * @param {String} unit The identifyer of the unit of the right operand
        * @param {String} status The identifyer of the status
        */
        Permission.prototype.addConstraint = function (name, operator, rightOperand, dataType, unit, status) {
            var newConstraint = new Constraint(name, operator, rightOperand, dataType, unit, status);
            this.constraints.push(newConstraint);
            return this;
        };

        /**
        * The method for adding a party to the Permission
        * @method addParty
        * @param {String} uid The Unique Identifier of the Party
        * @param {String} pfunction The identifier of the functional role this party takes
        * @param {String} scope The scope of the party
        */
        Permission.prototype.addParty = function (uid, pfunction, scope) {
            var newParty = new Party(uid, pfunction, scope);
            this.parties.push(newParty);
            return this;
        };

        /**
        * The method for adding a duty to the Permission
        * @method addParty
        * @param {Duty} newDuty A duty instance
        */
        Permission.prototype.addDuty = function (newDuty) {
            this.duties.push(newDuty);
            return this;
        };

        Permission.prototype.serializeXml = function (serStrIn) {
            var serStrOut = serStrIn + "<permission>";
            var i;
            for (i = 0; i < this.assets.length; i++) {
                serStrOut = this.assets[i].serializeXml(serStrOut);
            }
            if (this.action != undefined) {
                serStrOut = this.action.serializeXml(serStrOut);
            }
            for (i = 0; i < this.constraints.length; i++) {
                serStrOut = this.constraints[i].serializeXml(serStrOut);
            }
            for (i = 0; i < this.parties.length; i++) {
                serStrOut = this.parties[i].serializeXml(serStrOut);
            }
            for (i = 0; i < this.duties.length; i++) {
                serStrOut = this.duties[i].serializeXml(serStrOut);
            }
            serStrOut += "</permission>";
            return serStrOut;
        };

        Permission.prototype.buildOdrlInJson = function () {
            var thisP = {};
            var i;
            for (i = 0; i < this.assets.length; i++) {
                if (this.assets[i].relation == Odrl.nsUri + "target") {
                    thisP.target = this.assets[i].uid;
                }
                if (this.assets[i].relation == Odrl.nsUri + "output") {
                    thisP.output = this.assets[i].uid;
                }
            }
            thisP.action = this.action.name;

            if (this.constraints.length > 0) {
                thisP.constraints = [];
                var thisC;
                for (i = 0; i < this.constraints.length; i++) {
                    thisC = {};
                    thisC.name = this.constraints[i].name;
                    thisC.operator = this.constraints[i].operator;
                    thisC.rightoperand = this.constraints[i].rightOperand;
                    if (this.constraints[i].dataType != undefined && this.constraints[i].dataType !== "") {
                        thisC.rightoperanddatatype = this.constraints[i].dataType;
                    }
                    if (this.constraints[i].unit != undefined && this.constraints[i].unit !== "") {
                        thisC.rightoperandunit = this.constraints[i].unit;
                    }
                    if (this.constraints[i].status != undefined && this.constraints[i].status !== "") {
                        thisC.status = this.constraints[i].status;
                    }
                    thisP.constraints.push(thisC);
                }
            }

            for (i = 0; i < this.parties.length; i++) {
                if (this.parties[i].pfunction == Odrl.nsUri + "assigner") {
                    thisP.assigner = this.parties[i].uid;
                }
                if (this.parties[i].pfunction == Odrl.nsUri + "assignee") {
                    thisP.assignee = this.parties[i].uid;
                }
            }
            if (this.duties.length > 0) {
                thisP.duties = [];
                for (i = 0; i < this.duties.length; i++) {
                    thisP.duties.push(this.duties[i].buildDutyOdrlInJson());
                }
            }
            OdrlInJson.permissions.push(thisP);
        };

        Permission.prototype.validationResult = function () {
            var valResult = "";
            if (this.assets.length == 0) {
                valResult += "!! Permission: no asset assigned to it";
            }
            for (var i = 0; i < this.assets.length; i++) {
                valResult += this.assets[i].validationResult();
            }
            return valResult;
        };
        return Permission;
    })();
    Odrl.Permission = Permission;

    // ****************************************************
    /**
    * Class for the Prohibition of the ODRL Core Model
    * @class Prohibition
    * @constructor
    */
    var Prohibition = (function () {
        function Prohibition() {
            this.action = null;
            this.assets = [];
            this.constraints = [];
            this.parties = [];
        }
        /**
        * The method for setting the action of the Prohibition
        * @method setAction
        * @param {String} actionname The identifier of the action
        */
        Prohibition.prototype.setAction = function (actionname) {
            this.action = new Action(actionname);
            return this;
        };

        /**
        * The method for adding an asset to the Prohibition
        * @method addAsset
        * @param {String} uid The unique identifier of the asset
        * @param {String} relation The relation of the asset to the Duty.
        */
        Prohibition.prototype.addAsset = function (uid, relation) {
            var newAsset = new Asset(uid, relation);
            this.assets.push(newAsset);
            return this;
        };

        /**
        * The method for adding the required target asset to the Prohibition
        * @method addTargetAsset
        * @param {String} uid The unique identifier of the asset
        */
        Prohibition.prototype.addTargetAsset = function (uid) {
            var newAsset = new Asset(uid, Odrl.AssetRelationsCV.target);
            this.assets.push(newAsset);
            return this;
        };

        /**
        * The method for adding a constraint to the Prohibition
        * @method addConstraint
        * @param {String} name The identifing name of the Constraint
        * @param {String} operator The identifyer of the operator
        * @param {String} rightOperand The identifyer of the right operand
        * @param {String} dataType The identifyer of the data type of the right operand
        * @param {String} unit The identifyer of the unit of the right operand
        * @param {String} status The identifyer of the status
        */
        Prohibition.prototype.addConstraint = function (name, operator, rightOperand, dataType, unit, status) {
            var newConstraint = new Constraint(name, operator, rightOperand, dataType, unit, status);
            this.constraints.push(newConstraint);
            return this;
        };

        /**
        * The method for adding a party to the Prohibition
        * @method addParty
        * @param {String} uid The Unique Identifier of the Party
        * @param {String} pfunction The identifier of the functional role this party takes
        * @param {String} scope The scope of the party
        */
        Prohibition.prototype.addParty = function (uid, pfunction, scope) {
            var newParty = new Party(uid, pfunction, scope);
            this.parties.push(newParty);
            return this;
        };

        Prohibition.prototype.serializeXml = function (serStrIn) {
            var serStrOut = serStrIn + "<prohibition>";
            var i;
            for (i = 0; i < this.assets.length; i++) {
                serStrOut = this.assets[i].serializeXml(serStrOut);
            }
            if (this.action != undefined) {
                serStrOut = this.action.serializeXml(serStrOut);
            }
            for (i = 0; i < this.constraints.length; i++) {
                serStrOut = this.constraints[i].serializeXml(serStrOut);
            }
            for (i = 0; i < this.parties.length; i++) {
                serStrOut = this.parties[i].serializeXml(serStrOut);
            }
            serStrOut += "</prohibition>";
            return serStrOut;
        };

        Prohibition.prototype.buildOdrlInJson = function () {
            var thisP = {};
            var i;
            thisP.action = this.action.name;
            for (i = 0; i < this.assets.length; i++) {
                if (this.assets[i].relation == Odrl.nsUri + "target") {
                    thisP.target = this.assets[i].uid;
                }
                if (this.assets[i].relation == Odrl.nsUri + "output") {
                    thisP.output = this.assets[i].uid;
                }
            }
            if (this.constraints.length > 0) {
                thisP.constraints = [];
                var thisC;
                for (i = 0; i < this.constraints.length; i++) {
                    thisC = {};
                    thisC.name = this.constraints[i].name;
                    thisC.operator = this.constraints[i].operator;
                    thisC.rightoperand = this.constraints[i].rightOperand;
                    if (this.constraints[i].dataType != undefined && this.constraints[i].dataType !== "") {
                        thisC.rightoperanddatatype = this.constraints[i].dataType;
                    }
                    if (this.constraints[i].unit != undefined && this.constraints[i].unit !== "") {
                        thisC.rightoperandunit = this.constraints[i].unit;
                    }
                    if (this.constraints[i].status != undefined && this.constraints[i].status !== "") {
                        thisC.status = this.constraints[i].status;
                    }
                    thisP.constraints.push(thisC);
                }
            }
            for (i = 0; i < this.parties.length; i++) {
                if (this.parties[i].pfunction == Odrl.nsUri + "assigner") {
                    thisP.assigner = this.parties[i].uid;
                }
                if (this.parties[i].pfunction == Odrl.nsUri + "assignee") {
                    thisP.assignee = this.parties[i].uid;
                    if (this.parties[i].scope != "") {
                        thisP.assignee_scope = this.parties[i].scope;
                    }
                }
            }
        };
        return Prohibition;
    })();
    Odrl.Prohibition = Prohibition;

    // ****************************************************
    /**
    * Class for the Policy of the ODRL Core Model
    * @class Policy
    * @constructor
    * @param {String} uid The Unique Identifier of the Asset
    * @param {String} pType The identifier of the policy type
    */
    var Policy = (function () {
        function Policy(pUid, pType) {
            this.uid = pUid;
            this.type = Odrl.nsUri + pType;
            this.permissions = [];
            this.prohibitions = [];
        }
        /**
        * The method for setting the conflict property of the Policy
        * @method setConflict
        * @param {String} conflict The identifier of the conflict
        */
        Policy.prototype.setConflict = function (conflict) {
            this.conflict = conflict;
            return this;
        };

        /**
        * The method for adding a permission to the Policy
        * @method addPermission
        * @param {Permission} newPerm A permission instance
        */
        Policy.prototype.addPermission = function (newPerm) {
            this.permissions.push(newPerm);
            return this;
        };

        /**
        * The method for adding a Prohibition to the Policy
        * @method addProhibition
        * @param {Prohibition} newProhib A prohibition instance
        */
        Policy.prototype.addProhibition = function (newProhib) {
            this.prohibitions.push(newProhib);
            return this;
        };

        /**
        * The method for serializing the Policy to XML syntax
        * @method serializeXml
        */
        Policy.prototype.serializeXml = function () {
            var serStr = "<Policy uid=\"" + this.uid + "\" type=\"" + this.type + "\"";
            if (this.conflict != undefined && this.conflict != "") {
                serStr += " conflict=\"" + this.conflict + "\"";
            }
            serStr += " xmlns=\"" + Odrl.nsUri + "\" >";
            var i;
            for (i = 0; i < this.permissions.length; i++) {
                serStr = this.permissions[i].serializeXml(serStr);
            }
            for (i = 0; i < this.prohibitions.length; i++) {
                serStr = this.prohibitions[i].serializeXml(serStr);
            }
            serStr += "</Policy>";
            return serStr;
        };

        Policy.prototype.buildOdrlInJson = function () {
            OdrlInJson = {};
            OdrlInJson.policytype = this.type;
            OdrlInJson.policyid = this.uid;
            if (this.conflict != undefined && this.conflict != "") {
                OdrlInJson.conflict = this.conflict;
            }
            if (this.undefined != undefined && this.undefined != "") {
                OdrlInJson.undefined = this.undefined;
            }
            if (this.inheritAllowed != undefined && this.inheritAllowed != "") {
                OdrlInJson.inheritallowed = this.inheritAllowed;
            }
            if (this.inheritFrom != undefined && this.inheritFrom != "") {
                OdrlInJson.inheritfrom = this.inheritFrom;
            }
            if (this.inheritRelation != undefined && this.inheritRelation != "") {
                OdrlInJson.inheritrelation = this.inheritRelation;
            }
            if (this.profile != undefined && this.profile != "") {
                OdrlInJson.profile = this.profile;
            }
            if (this.permissions.length > 0) {
                OdrlInJson.permissions = [];
                for (var i = 0; i < this.permissions.length; i++) {
                    this.permissions[i].buildOdrlInJson();
                }
            }
            if (this.prohibitions.length > 0) {
                OdrlInJson.permissions = [];
                for (var i = 0; i < this.prohibitions.length; i++) {
                    this.prohibitions[i].buildOdrlInJson();
                }
            }
        };

        /**
        * The method for validating the data, returns a string
        * @method validationResult
        */
        Policy.prototype.validationResult = function () {
            var valResult = "";
            if (this.permissions.length == 0 && this.prohibitions.length == 0) {
                valResult += "!! Policy does not contain a permission or a prohibition \n";
            }
            for (var i = 0; i < this.permissions.length; i++) {
                valResult += this.permissions[i].validationResult();
            }

            return valResult;
        };

        /**
        * The method for serializing the Policy to the official ODRL JSON syntax
        * @method serializeJson
        */
        Policy.prototype.serializeJson = function () {
            this.buildOdrlInJson();
            return JSON.stringify(OdrlInJson, null, 2);
        };

        /**
        * The method for serializing the Policy to JSON reflecting the Core Model
        * @method serializeCoreModelJson
        */
        Policy.prototype.serializeCoreModelJson = function () {
            return JSON.stringify(this, null, 2);
        };
        return Policy;
    })();
    Odrl.Policy = Policy;
})(Odrl || (Odrl = {}));
//# sourceMappingURL=ODRLclasses.js.map
