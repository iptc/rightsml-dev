/**
* development timestamp: 2014-06-23
* development by Michael W. Steidl (www.linkedin.com/in/michaelwsteidl)
*
* This module provides all classes of the ODRL data model
*
*/
var Odrl;
(function (Odrl) {
    // Constant values:
    Odrl.nsUri = "http://www.w3.org/ns/odrl/2/";
    Odrl.nsPrefix = "o";

    var OdrlInJson;

    // The classes:
    // ****************************************************
    var Asset = (function () {
        function Asset(uid, relation) {
            this.uid = uid;
            this.relation = relation;
        }
        Asset.prototype.serializeXml = function (serStrIn) {
            return serStrIn + "<asset uid=\"" + this.uid + "\" relation=\"" + this.relation + "\"/>";
        };
        return Asset;
    })();
    Odrl.Asset = Asset;

    // ****************************************************
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
    var Duty = (function () {
        function Duty() {
            this.uid = null;
            this.assets = [];
            this.constraints = [];
            this.parties = [];
        }
        Duty.prototype.setUid = function (uid) {
            this.uid = uid;
            return this;
        };

        Duty.prototype.setAction = function (actionname) {
            this.action = new Action(actionname);
            return this;
        };

        Duty.prototype.addAsset = function (uid, relation) {
            var newAsset = new Asset(uid, relation);
            this.assets.push(newAsset);
            return this;
        };

        Duty.prototype.addConstraint = function (name, operator, rightOperand, dataType, unit, status) {
            var newConstraint = new Constraint(name, operator, rightOperand, dataType, unit, status);
            this.constraints.push(newConstraint);
            return this;
        };

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
    var Permission = (function () {
        function Permission() {
            this.action = null;
            this.assets = [];
            this.constraints = [];
            this.parties = [];
            this.duties = [];
        }
        Permission.prototype.setAction = function (actionname) {
            this.action = new Action(actionname);
            return this;
        };

        Permission.prototype.addAsset = function (uid, relation) {
            var newAsset = new Asset(uid, relation);
            this.assets.push(newAsset);
            return this;
        };

        Permission.prototype.addConstraint = function (name, operator, rightOperand, dataType, unit, status) {
            var newConstraint = new Constraint(name, operator, rightOperand, dataType, unit, status);
            this.constraints.push(newConstraint);
            return this;
        };

        Permission.prototype.addParty = function (uid, pfunction, scope) {
            var newParty = new Party(uid, pfunction, scope);
            this.parties.push(newParty);
            return this;
        };

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
        return Permission;
    })();
    Odrl.Permission = Permission;

    // ****************************************************
    var Prohibition = (function () {
        function Prohibition() {
            this.action = null;
            this.assets = [];
            this.constraints = [];
            this.parties = [];
        }
        Prohibition.prototype.setAction = function (actionname) {
            this.action = new Action(actionname);
            return this;
        };

        Prohibition.prototype.addAsset = function (uid, relation) {
            var newAsset = new Asset(uid, relation);
            this.assets.push(newAsset);
            return this;
        };

        Prohibition.prototype.addConstraint = function (name, operator, rightOperand, dataType, unit, status) {
            var newConstraint = new Constraint(name, operator, rightOperand, dataType, unit, status);
            this.constraints.push(newConstraint);
            return this;
        };

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
    var Policy = (function () {
        function Policy(pUid, pType) {
            this.uid = pUid;
            this.type = Odrl.nsUri + pType;
            this.permissions = [];
            this.prohibitions = [];
        }
        Policy.prototype.setConflict = function (conflict) {
            this.conflict = conflict;
            return this;
        };

        Policy.prototype.addPermission = function (newPerm) {
            this.permissions.push(newPerm);
            return this;
        };

        Policy.prototype.addProhibition = function (newProhib) {
            this.prohibitions.push(newProhib);
            return this;
        };

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

        Policy.prototype.serializeJson = function () {
            this.buildOdrlInJson();
            return JSON.stringify(OdrlInJson, null, 2);
        };
        return Policy;
    })();
    Odrl.Policy = Policy;
})(Odrl || (Odrl = {}));
//# sourceMappingURL=ODRLclasses.js.map
