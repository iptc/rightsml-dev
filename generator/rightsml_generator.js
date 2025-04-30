'use strict';
function isEmpty(value) {
  return value && Object.keys(value).length === 0;
}

class RightsMLGenerator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            output: '',
            outputformat: 'turtle',
            targetasseturi: '',
            actionuri: 'http://www.w3.org/ns/odrl/2/use',
            assigneruri: '',
            assigneeuri: '',
            assigneeIsPartyCollection: false,
            geoconstraint: false,
            geoincludeexclude: 'exclude',
            timeperiodconstraint: false,
            datebeforeafter: '',
            constraintdate: '',
            platformconstraint: false,
            platformincludeexclude: 'exclude',
            platform: '',
            dutytopay: false,
            dutyamount: '',
            dutycurrency: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
        /* $('[data-toggle="tooltip"]').tooltip();
        this.refreshOutput(); */
    }

    componentDidUpdate() {
        /* $('[data-toggle="tooltip"]').tooltip(); */
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked
            : target.type === 'select-multiple' ? [...target.selectedOptions].map(o => o.value)
            : target.value;
        const name = target.name;
        // setState is asynchronous so we update the output after completion using the callback
        this.setState({
            [name]: value
        }, this.refreshOutput);
    }

    handleSubmit(event) {
        /* there's no submit button but just in case some automatic feature tries to submit the form... */
        event.preventDefault();
    }
 
    refreshOutput() {
        var output = this.getRightsMLOutput();
        this.setState({output: output});
    }

    getCommonData() {
        const policyguid = `http://example.com/RightsML/example-policy/${new Date().toISOString().slice(0, 10)}`;
        const profile = 'https://iptc.org/std/RightsML/odrl-profile/';
        let permission = {};

        if (this.state.targetasseturi) permission.target = this.state.targetasseturi;
        if (this.state.actionuri) permission.action = this.state.actionuri;
        if (this.state.assigneruri) permission.assigner = this.state.assigneruri;
        if (this.state.assigneeuri) {
            permission.assignee = this.state.assigneeIsPartyCollection
                ? { "@type": "PartyCollection", "uid": this.state.assigneeuri }
                : this.state.assigneeuri;
        }

        const constraints = [];
        if (this.state.geoconstraint) {
            constraints.push({
                leftOperand: "spatial",
                operator: this.state.geoincludeexclude === 'include' ? 'eq' : 'neq',
                rightOperand: this.state.geography
            });
        }
        if (this.state.timeperiodconstraint) {
            constraints.push({
                leftOperand: "dateTime",
                operator: this.state.datebeforeafter === 'before' ? 'lt' : 'gt',
                rightOperand: {
                    "@value": this.state.constraintdate,
                    "@type": "xsd:date"
                }
            });
        }
        if (this.state.platformconstraint) {
            constraints.push({
                leftOperand: "deliveryChannel",
                operator: this.state.platformincludeexclude === 'include' ? 'eq' : 'neq',
                rightOperand: this.state.platform
            });
        }
        if (!isEmpty(constraints)) {
            permission.constraint = constraints;
        }

        const duties = [];
        if (this.state.dutytopay) {
            duties.push({
                action: {
                    value: "http://www.w3.org/ns/odrl/2/compensate",
                    refinement: {
                        operator: "http://www.w3.org/ns/odrl/2/eq",
                        rightOperand: this.state.dutyamount,
                        dataType: "http://www.w3.org/2001/XMLSchema#decimal",
                        unit: `http://cvx.iptc.org/iso4217a/${this.state.dutycurrency}`
                    }
                }
            });
        }
        if (!isEmpty(duties)) {
            permission.duty = duties;
        }

        return { policyguid, profile, permission };
    }

    getRightsMLOutput() {
        const { policyguid, profile, permission } = this.getCommonData();

        if (this.state.outputformat === 'jsonld') {
            return this.generateJSONLD(policyguid, profile, permission);
        } else if (this.state.outputformat === 'rdfxml') {
            return this.generateRDFXML(policyguid, profile, permission);
        } else if (this.state.outputformat === 'turtle') {
            return this.generateTurtle(policyguid, profile, permission);
        }
    }

    generateJSONLD(policyguid, profile, permission) {
        return JSON.stringify({
            "@context": [
                "http://www.w3.org/ns/odrl.jsonld",
                "https://iptc.org/std/RightsML/odrl-profile/rightsml.jsonld"
            ],
            "@type": "Set",
            "uid": policyguid,
            "profile": profile,
            "permission": [permission]
        }, null, 2);
    }

    generateTurtle(policyguid, profile, permission) {
        const prefixes = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix rightsml: <https://iptc.org/std/RightsML/odrl-profile/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<${policyguid}>
    a odrl:Set ;
    odrl:profile <${profile}> ;
    odrl:permission [
`;
        let lines = [];
        if (permission.target) lines.push(`        odrl:target <${permission.target}> ;`);
        if (permission.assigner) lines.push(`        odrl:assigner <${permission.assigner}> ;`);
        if (permission.assignee) {
            if (typeof permission.assignee === 'object') {
                lines.push(`        odrl:assignee [ a odrl:PartyCollection ; odrl:uid <${permission.assignee.uid}> ] ;`);
            } else {
                lines.push(`        odrl:assignee <${permission.assignee}> ;`);
            }
        }
        if (permission.action) lines.push(`        odrl:action <${permission.action}> ;`);
        if (permission.constraint) {
            permission.constraint.forEach(c => {
                const ro = typeof c.rightOperand === 'object' ? c.rightOperand["@value"] : c.rightOperand;
                lines.push(`        odrl:constraint [ odrl:leftOperand odrl:${c.leftOperand} ; odrl:operator odrl:${c.operator} ; odrl:rightOperand <${ro}> ] ;`);
            });
        }
        if (permission.duty) {
            permission.duty.forEach(d => {
                lines.push(`        odrl:duty [
            odrl:action <${d.action.value}> ;
            odrl:refinement [
                odrl:operator <${d.action.refinement.operator}> ;
                odrl:rightOperand "${d.action.refinement.rightOperand}"^^<${d.action.refinement.dataType}> ;
                odrl:unit <${d.action.refinement.unit}>
            ]
        ] ;`);
            });
        }
        return prefixes + lines.join('\n') + '\n    ] .';
    }

    generateRDFXML(policyguid, profile, permission) {
        const odrlNS = 'http://www.w3.org/ns/odrl/2/';
        const rdfNS = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';

        const doc = document.implementation.createDocument(rdfNS, 'rdf:RDF', null);
        const rdfElem = doc.documentElement;
        rdfElem.setAttribute('xmlns:odrl', odrlNS);

        const policyElem = doc.createElementNS(odrlNS, 'odrl:Set');
        policyElem.setAttributeNS(rdfNS, 'rdf:about', policyguid);

        const profileElem = doc.createElementNS(odrlNS, 'odrl:profile');
        profileElem.setAttributeNS(rdfNS, 'rdf:resource', profile);
        policyElem.appendChild(profileElem);

        const permissionWrapElem = doc.createElementNS(odrlNS, 'odrl:permission');
        const permissionElem = doc.createElementNS(odrlNS, 'odrl:Permission');

        if (permission.target) {
            const targetElem = doc.createElementNS(odrlNS, 'odrl:target');
            targetElem.setAttributeNS(rdfNS, 'rdf:resource', permission.target);
            permissionElem.appendChild(targetElem);
        }
        if (permission.assigner) {
            const assignerElem = doc.createElementNS(odrlNS, 'odrl:assigner');
            assignerElem.setAttributeNS(rdfNS, 'rdf:resource', permission.assigner);
            permissionElem.appendChild(assignerElem);
        }
        if (permission.assignee) {
            if (typeof permission.assignee === 'object') {
                const assigneeElem = doc.createElementNS(odrlNS, 'odrl:assignee');
                const partyElem = doc.createElementNS(odrlNS, 'odrl:PartyCollection');
                partyElem.setAttributeNS(rdfNS, 'rdf:about', permission.assignee.uid);
                assigneeElem.appendChild(partyElem);
                permissionElem.appendChild(assigneeElem);
            } else {
                const assigneeElem = doc.createElementNS(odrlNS, 'odrl:assignee');
                assigneeElem.setAttributeNS(rdfNS, 'rdf:resource', permission.assignee);
                permissionElem.appendChild(assigneeElem);
            }
        }
        if (permission.action) {
            const actionElem = doc.createElementNS(odrlNS, 'odrl:action');
            actionElem.setAttributeNS(rdfNS, 'rdf:resource', permission.action);
            permissionElem.appendChild(actionElem);
        }
        if (permission.constraint) {
            permission.constraint.forEach(c => {
                const constraintWrap = doc.createElementNS(odrlNS, 'odrl:constraint');
                const constraint = doc.createElementNS(odrlNS, 'odrl:Constraint');

                const left = doc.createElementNS(odrlNS, 'odrl:leftOperand');
                left.textContent = `odrl:${c.leftOperand}`;
                constraint.appendChild(left);

                const op = doc.createElementNS(odrlNS, 'odrl:operator');
                op.setAttributeNS(rdfNS, 'rdf:resource', `http://www.w3.org/ns/odrl/2/${c.operator}`);
                constraint.appendChild(op);

                const ro = doc.createElementNS(odrlNS, 'odrl:rightOperand');
                const roVal = typeof c.rightOperand === 'object' ? c.rightOperand['@value'] : c.rightOperand;
                ro.setAttributeNS(rdfNS, 'rdf:resource', roVal);
                constraint.appendChild(ro);

                constraintWrap.appendChild(constraint);
                permissionElem.appendChild(constraintWrap);
            });
        }
        if (permission.duty) {
            permission.duty.forEach(d => {
                const dutyWrap = doc.createElementNS(odrlNS, 'odrl:duty');
                const duty = doc.createElementNS(odrlNS, 'odrl:Duty');

                const action = doc.createElementNS(odrlNS, 'odrl:action');
                action.setAttributeNS(rdfNS, 'rdf:resource', d.action.value);
                duty.appendChild(action);

                const refinementWrap = doc.createElementNS(odrlNS, 'odrl:refinement');
                const refinement = doc.createElementNS(odrlNS, 'odrl:Constraint');

                const op = doc.createElementNS(odrlNS, 'odrl:operator');
                op.setAttributeNS(rdfNS, 'rdf:resource', d.action.refinement.operator);
                refinement.appendChild(op);

                const ro = doc.createElementNS(odrlNS, 'odrl:rightOperand');
                ro.setAttribute('rdf:datatype', d.action.refinement.dataType);
                ro.textContent = d.action.refinement.rightOperand;
                refinement.appendChild(ro);

                const unit = doc.createElementNS(odrlNS, 'odrl:unit');
                unit.setAttributeNS(rdfNS, 'rdf:resource', d.action.refinement.unit);
                refinement.appendChild(unit);

                refinementWrap.appendChild(refinement);
                duty.appendChild(refinementWrap);
                dutyWrap.appendChild(duty);
                permissionElem.appendChild(dutyWrap);
            });
        }

        permissionWrapElem.appendChild(permissionElem);
        policyElem.appendChild(permissionWrapElem);
        rdfElem.appendChild(policyElem);

        /* simple XML output as string
        const serializer = new XMLSerializer();
        return serializer.serializeToString(doc);
        */

        /* turn XML object into string */
        // var serializer = new XMLSerializer();
        var xmlString = (new XMLSerializer()).serializeToString(doc);
        xmlString = this.xmlpretty(xmlString, 1);
        const xmlDecl = '<?xml version="1.0" encoding="UTF-8"?>'
        var xmlDocAsString =  xmlDecl + '\n' + xmlString.toString();
        return(xmlDocAsString);
    }

    generateTurtle(policyguid, rightsmlProfile, permission) {
        const prefixes = `
    @prefix odrl: <http://www.w3.org/ns/odrl/2/> .
    @prefix rightsml: <https://iptc.org/std/RightsML/odrl-profile/> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

    <${policyguid}>
        a odrl:Set ;
        odrl:profile <${rightsmlProfile}> ;
        odrl:permission [
    `;
        let lines = [];
        if (permission.target) lines.push(`        odrl:target <${permission.target}> ;`);
        if (permission.assigner) lines.push(`        odrl:assigner <${permission.assigner}> ;`);
        if (permission.assignee) {
            if (typeof permission.assignee === 'object') {
                lines.push(`        odrl:assignee [ a odrl:PartyCollection ; odrl:uid <${permission.assignee.uid}> ] ;`);
            } else {
                lines.push(`        odrl:assignee <${permission.assignee}> ;`);
            }
        }
        if (permission.action) lines.push(`        odrl:action <${permission.action}> ;`);
        if (permission.constraint) {
            permission.constraint.forEach(c => {
                const ro = typeof c.rightOperand === 'object' ? c.rightOperand["@value"] : c.rightOperand;
                lines.push(`        odrl:constraint [ odrl:leftOperand odrl:${c.leftOperand} ; odrl:operator odrl:${c.operator} ; odrl:rightOperand <${ro}> ] ;`);
            });
        }
        if (permission.duty) {
            permission.duty.forEach(d => {
                lines.push(`        odrl:duty [
            odrl:action <${d.action.value}> ;
            odrl:refinement [
                odrl:operator <${d.action.refinement.operator}> ;
                odrl:rightOperand "${d.action.refinement.rightOperand}"^^<${d.action.refinement.dataType}> ;
                odrl:unit <${d.action.refinement.unit}>
            ]
        ] ;`);
            });
        }
        return prefixes + lines.join('\n') + '\n    ] .';
    }

    copyToClipboard = (e) => {
        this.textArea.select();
        document.execCommand('copy');
        // This is just personal preference.
        // I prefer to not show the whole text area selected.
        e.target.focus();
        this.setState({ copySuccess: 'Copied!' });
        e.preventDefault();
    };

    // used by xmlpretty below
    createShiftArr(step) {
        var space = '    ';
        if ( isNaN(parseInt(step)) ) {  // argument is string
            space = step;
        } else { // argument is integer
            switch(step) {
                case 1: space = '  '; break;
                case 2: space = '    '; break;
                case 3: space = '      '; break;
                case 4: space = '        '; break;
                case 5: space = '          '; break;
                case 6: space = '            '; break;
                case 7: space = '              '; break;
                case 8: space = '                '; break;
                case 9: space = '                  '; break;
                case 10: space = '                    '; break;
                case 11: space = '                      '; break;
                case 12: space = '                        '; break;
            }
        }

        var shift = ['\n']; // array of shifts
        for(var ix=0;ix<100;ix++){
            shift.push(shift[ix]+space);
        }
        return shift;
    }

    xmlpretty(text,step) {
        var shift = this.createShiftArr(step);
        var ar = text.replace(/>\s{0,}</g,"><")
                     .replace(/</g,"~::~<")
                     .replace(/\s*xmlns\:/g,"~::~xmlns:")
                     .replace(/\s*xmlns\=/g,"~::~xmlns=")
                     .split('~::~'),
            len = ar.length,
            inComment = false,
            deep = 0,
            str = '',
            ix = 0,
            shift = step ? this.createShiftArr(step) : shift;

        for(ix=0;ix<len;ix++) {
            // start comment or <![CDATA[...]]> or <!DOCTYPE //
            if(ar[ix].search(/<!/) > -1) {
                str += shift[deep]+ar[ix];
                inComment = true;
                // end comment  or <![CDATA[...]]> //
                if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1 ) {
                    inComment = false;
                }
            } else
            // end comment  or <![CDATA[...]]> //
            if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
                str += ar[ix];
                inComment = false;
            } else
            // <elm></elm> //
            if( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
                /^<[\w:\-\.\,]+/.exec(ar[ix-1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) {
                str += ar[ix];
                if(!inComment) deep--;
            } else
             // <elm> //
            if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1 && ar[ix].search(/\/>/) == -1 ) {
                str = !inComment ? str += shift[deep++]+ar[ix] : str += ar[ix];
            } else
             // <elm>...</elm> //
            if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
                str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
            } else
            // </elm> //
            if(ar[ix].search(/<\//) > -1) {
                str = !inComment ? str += shift[--deep]+ar[ix] : str += ar[ix];
            } else
            // <elm/> //
            if(ar[ix].search(/\/>/) > -1 ) {
                str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
            } else
            // <? xml ... ?> //
            if(ar[ix].search(/<\?/) > -1) {
                str += shift[deep]+ar[ix];
            } else
            // xmlns //
            if( ar[ix].search(/xmlns\:/) > -1  || ar[ix].search(/xmlns\=/) > -1) {
                str += shift[deep]+ar[ix];
            }

            else {
                str += ar[ix];
            }
        }

        return  (str[0] == '\n') ? str.slice(1) : str;
    }

    render() {
        var outputtext = "View the generated RightsML";
        return (
<form name="indata" method="post" onSubmit={this.handleSubmit}>
    <div className="row">
        <div className="col">
            <legend>Enter RightsML policy content</legend>
                <div className="row">
                    <b className="col">Generic properties</b>
                </div>
                <div className="row">
                    <label className="col-sm-4 col-form-label" htmlFor="subheadline">Target Asset URI</label>
                    <div className="col-sm-8">
                        <input className="form-control form-control-sm" type="text" id="subheadline" name="targetasseturi" size="40" title="Target Asset URI" value={this.state.targetasseturi} onChange={this.handleInputChange} tabIndex="8" />
                    </div>
                </div>
                <div className="row">
                    <label className="col-sm-4 col-form-label" htmlFor="provider">Assignee can...</label>
                    <div className="col-sm-8">
                        <select className="form-control form-control-sm" id="actionuri" name="actionuri" size="1" width="25" title="Select the applicable action" value={this.state.actionuri} onChange={this.handleInputChange} tabIndex="7">
                            <option value="">Choose an action type</option>
                            <option value="http://www.w3.org/ns/odrl/2/aggregate">Aggregate</option>
                            <option value="http://www.w3.org/ns/odrl/2/archive">Archive</option>
                            <option value="http://www.w3.org/ns/odrl/2/derive">Derive</option>
                            <option value="http://www.w3.org/ns/odrl/2/distribute">Distribute</option>
                            <option value="http://www.w3.org/ns/odrl/2/display">Display</option>
                            <option value="http://www.w3.org/ns/odrl/2/index">Index</option>
                            <option value="http://www.w3.org/ns/odrl/2/modify">Modify</option>
                            <option value="http://www.w3.org/ns/odrl/2/play">Play</option>
                            <option value="http://www.w3.org/ns/odrl/2/present">Present</option>
                            <option value="http://www.w3.org/ns/odrl/2/print">Print</option>
                            <option value="http://www.w3.org/ns/odrl/2/sell">Sell</option>
                            <option value="http://www.w3.org/ns/odrl/2/use">Use</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <label className="col-sm-4 col-form-label" htmlFor="assigneruri">Assigner (URI)</label>
                    <div className="col-sm-8">
                        <input className="form-control form-control-sm" type="text" id="assigneruri" name="assigneruri" size="40" title="Assigner URI" value={this.state.assigneruri} onChange={this.handleInputChange} tabIndex="13" />
                    </div>
                </div>
                <div className="row">
                    <label className="col-sm-4 col-form-label" htmlFor="assigneeuri">Assignee (URI)</label>
                    <div className="col-sm-8">
                        <input className="form-control form-control-sm" type="text" id="assigneeuri" name="assigneeuri" size="40" title="Assignee URI" value={this.state.assigneeuri} onChange={this.handleInputChange}  tabIndex="14" />
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="checkbox" id="assigneeIsPartyCollection" name="assigneeIsPartyCollection" value={this.state.assigneeIsPartyCollection} onChange={this.handleInputChange} tabIndex="15" />
                          <label className="form-check-label" htmlFor="assigneeIsPartyCollection">Assignee is a group (PartyCollection)</label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <b className="col-sm-12">Constraints</b>
                </div>
                <div className="col-sm-12">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="geo" name="geoconstraint" value={this.state.geoconstraint} onChange={this.handleInputChange} tabIndex="7" />
                        <label className="form-check-label" htmlFor="geo">Geographic constraint</label>
                    </div>
                </div>
                <div id="geoconstraints">
                    <div className="row">
                        <label className="col-sm-4 col-form-label text-right" htmlFor="provider">Geography</label>
                        <div className="col-sm-8">
                            <select className="form-control form-control-sm" id="geography" name="geography" size="1" width="25" title="Select the applicable geography" value={this.state.geography} onChange={this.handleInputChange} tabIndex="7">
                                <option value="">Choose a geography</option>
                                <option value="http://cvx.iptc.org/iso3166-1a3/CHN">China</option>
                                <option value="http://cvx.iptc.org/iso3166-1a3/FRA">France</option>
                                <option value="http://cvx.iptc.org/iso3166-1a3/DEU">Germany</option>
                                <option value="http://cvx.iptc.org/iso3166-1a3/ITA">Italy</option>
                                <option value="http://cvx.iptc.org/iso3166-1a3/NOR">Norway</option>
                                <option value="http://cvx.iptc.org/iso3166-1a3/ESP">Spain</option>
                                <option value="http://cvx.iptc.org/iso3166-1a3/SWE">Sweden</option>
                                <option value="http://cvx.iptc.org/iso3166-1a3/GBR">UK</option>
                                <option value="http://cvx.iptc.org/iso3166-1a3/USA">USA</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">&nbsp;</div>
                        <div className="col-sm-8">
                            <div className="form-check form-check-inline">
                              <input className="form-check-input" type="radio" id="geoinclude" name="geoincludeexclude" value="include" title="Only this geography" onChange={this.handleInputChange} tabIndex="8" />
                              <label className="form-check-label" htmlFor="geoinclude">Only this geography</label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input className="form-check-input" type="radio" id="geoexclude" defaultChecked name="geoincludeexclude" value="exclude" title="Exclude geography" onChange={this.handleInputChange} tabIndex="9" />
                              <label className="form-check-label" htmlFor="geoexclude">All except for this geography</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="timeperiod" name="timeperiodconstraint" value={this.state.timeperiodconstraint} onChange={this.handleInputChange} tabIndex="7" />
                        <label className="form-check-label" htmlFor="timeperiod">Time constraint</label>
                    </div>
                </div>
                <div className="row">
                    <label className="col-sm-4 col-form-label text-right" htmlFor="constraintdate">Date</label>
                    <div className="col-sm-8">
                        <input className="form-control form-control-sm" type="date" id="constraintdate" name="constraintdate" title="Constraint Date" value={this.state.constraintdate} onChange={this.handleInputChange} tabIndex="13" />
                    </div>
                </div>
                <div className="row">
                    <label className="col-sm-4 col-form-label" htmlFor="provider">&nbsp;</label>
                    <div className="col-sm-8">
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" id="datebefore" name="datebeforeafter" value="before" onChange={this.handleInputChange} tabIndex="13" />
                          <label className="form-check-label" htmlFor="datebefore">Can use until this date (expires)</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" id="dateafter" name="datebeforeafter" value="after" defaultChecked onChange={this.handleInputChange} tabIndex="13"/>
                          <label className="form-check-label" htmlFor="dateafter">Can use after this date (embargo)</label>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="platformconstraint" name="platformconstraint" value={this.state.platformconstraint} onChange={this.handleInputChange} tabIndex="9" />
                        <label className="form-check-label" htmlFor="platformconstraint">Platform constraint</label>
                    </div>
                </div>
                <div className="row">
                    <label className="col-sm-4 col-form-label text-right" htmlFor="constraintplatform">Platform</label>
                    <div className="col-sm-8">
                        <select className="form-control form-control-sm" id="platform" name="platform" size="1" width="25" title="Select the applicable platform" value={this.state.platform} onChange={this.handleInputChange} tabIndex="7">
                            <option value="">Choose a platform</option>
                            <option value="advertising">Advertising</option>
                            <option value="mobile">Mobile</option>
                            <option value="print">Print</option>
                            <option value="tv">TV</option>
                            <option value="web">Web</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-4">&nbsp;</div>
                    <div className="col-sm-8">
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" id="platforminclude" name="platformincludeexclude" value="include" title="Only this platform" onChange={this.handleInputChange} tabIndex="8" />
                          <label className="form-check-label" htmlFor="platforminclude">Only this platform</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" id="platformexclude" defaultChecked name="platformincludeexclude" value="exclude" title="All except this platform" onChange={this.handleInputChange} tabIndex="9" />
                          <label className="form-check-label" htmlFor="platformexclude">All except this platform</label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <b className="col-sm-12">Duties</b>
                </div>
                <div className="col-sm-12">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="dutytopay" name="dutytopay" value={this.state.dutytopay} onChange={this.handleInputChange} tabIndex="9" />
                        <label className="form-check-label" htmlFor="dutytopay">Duty to pay</label>
                    </div>
                </div>
                <div className="row">
                    <label className="col-sm-4 col-form-label text-right" htmlFor="dutyamount">Amount to pay</label>
                    <div className="col-sm-8">
                        <div className="row">
                        <input className="form-control form-control-sm col-sm" type="text" id="dutyamount" name="dutyamount" size="10" value={this.state.dutyamount} onChange={this.handleInputChange} tabIndex="7" />
                        &nbsp;
                        <select className="form-control form-control-sm col-sm" id="dutycurrency" name="dutycurrency" size="1" width="5" title="Select the applicable currency" value={this.state.dutycurrency} onChange={this.handleInputChange} tabIndex="7">
                            <option value="">Choose currency</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="NOK">NOK</option>
                            <option value="USD">USD</option>
                        </select>
                        </div>
                    </div>
                </div>
             </div>
        <div className="col">
            <div className="outputbox">
                <legend>{outputtext} <a href="#" className="btn btn-primary" role="button" onClick={this.copyToClipboard}>Copy to clipboard <i className="fas fa-copy" /></a></legend>
                <div className="row">
                    <div className="col-sm-4">
                        Choose output format:
                    </div>
                    <div className="col-sm-8">
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" defaultChecked name="outputformat" id="turtle" value="turtle" title="Output format - Turtle" onChange={this.handleInputChange} tabIndex="21" />&nbsp;
                            <label className="form-check-label" htmlFor="turtle">Turtle</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="outputformat" id="jsonld" value="jsonld" title="Output format - JSON-LD" onChange={this.handleInputChange} tabIndex="22" />&nbsp;
                            <label className="form-check-label" htmlFor="jsonld">JSON-LD</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="outputformat" id="rdfxml" value="rdfxml" title="Output format - RDF/XML" onChange={this.handleInputChange} tabIndex="23" />&nbsp;
                            <label className="form-check-label" htmlFor="rdfxml">RDF/XML</label>
                        </div>
                    </div>
                </div>
                <textarea className="form-control" name="output" style={{'height': '100%', 'fontSize': '15px'}} rows="20" tabIndex="25" value={this.state.output} ref={(textarea) => this.textArea = textarea} readOnly></textarea>
            </div>
        </div>
    </div>
</form>
        )
    }
}

const domContainer = document.querySelector('#reactcontainer');
ReactDOM.render(<RightsMLGenerator/>, domContainer);
