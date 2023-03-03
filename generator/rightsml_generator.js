'use strict';

class RightsMLGenerator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            output: '',
            outputformat: 'jsonld',
            targetasseturi: '',
            actionuri: '',
            assigneruri: '',
            assigneeuri: '',
            assigneeIsPartyCollection: false,
            geoconstraint: false,
            geoincludeexclude: 'exclude',
            timeperiodconstraint: false,
            constraintdate: '',
            datebeforeafter: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        $('[data-toggle="tooltip"]').tooltip();
        this.refreshOutput();
    }
    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
    }
    refreshOutput() {    
        var output = this.getRightsMLOutput();
        this.setState({output: output});
    }
    getRightsMLOutput() {
        var odrlNS = 'http://www.w3.org/ns/odrl/2/';
        var rootElement = 'o:Policy'
        var rightsmlType = 'http://www.w3.org/ns/odrl/2/Set';
        var rightsmlProfile = 'https://iptc.org/std/RightsML/odrl-profile/';
        // set policy guid using today's date
        var todaysDate = new Date().toISOString().slice(0, 10);
        var policyguid = "http://example.com/RightsML/example-policy/"+todaysDate;
        if (this.state.targetasseturi) {
            var targetasseturi = this.state.targetasseturi;
        }
        if (this.state.actionuri) {
            var actionuri = this.state.actionuri;
        }
        if (this.state.assigneruri) {
            var assigneruri = this.state.assigneruri;
        }
        if (this.state.assigneeuri) {
            var assigneeuri = this.state.assigneeuri;
        }
        if (this.state.assigneeIsPartyCollection) {
            var assigneeIsPartyCollection = this.state.assigneeIsPartyCollection;
        }
        if (this.state.geoconstraint) {
            var geoconstraint = this.state.geoconstraint;
            var geoconstraintoperator = this.state.geoincludeexclude == 'include' ? 'eq' : 'ne';
            var geography = this.state.geography || '';
        }
        if (this.state.timeperiodconstraint) {
            var timeperiodconstraint = this.state.timeperiodconstraint;
            var constraintdate = this.state.constraintdate;
            var beforeafteroperator = this.state.datebeforeafter == 'before' ? 'lt' : 'gt';
        }
        /* now output the object in various serialisations */
        if (this.state.outputformat == 'rdfxml') {
            var xmlDoc = document.implementation.createDocument(
                odrlNS, rootElement, null
            );
            var rightsmlDoc = xmlDoc.documentElement;
            rightsmlDoc.setAttribute('type', rightsmlType);
            rightsmlDoc.setAttribute('profile', rightsmlProfile);
            rightsmlDoc.setAttribute('uid', policyguid);

            var permissionElem = document.createElementNS(odrlNS, 'o:permission', null);
            if (targetasseturi) {
                var assetElem = document.createElementNS(odrlNS, 'o:asset', null);
                assetElem.setAttribute('uid', targetasseturi);
                assetElem.setAttribute('relation', 'http://www.w3.org/ns/odrl/2/target');
                permissionElem.appendChild(assetElem);
            }
            if (actionuri) {
                var actionElem = document.createElementNS(odrlNS, 'o:action', null);
                actionElem.setAttribute('name', actionuri);
                permissionElem.appendChild(actionElem);
            }
            if (assigneruri) {
                var assignerpartyElem = document.createElementNS(odrlNS, 'o:party', null);
                assignerpartyElem.setAttribute('uid', assigneruri);
                assignerpartyElem.setAttribute('function', odrlNS+'assigner');
                permissionElem.appendChild(assignerpartyElem);
            }
            if (assigneeuri) {
                var assigneepartyElem = document.createElementNS(odrlNS, 'o:party', null);
                assigneepartyElem.setAttribute('uid', assigneeuri);
                assigneepartyElem.setAttribute('function', odrlNS+'assignee');
                if (assigneeIsPartyCollection) {
                    assigneepartyElem.setAttribute('type', odrlNS+'PartyCollection');
                }
                permissionElem.appendChild(assigneepartyElem);
            }
             if (geoconstraint) {
                var constraintElem = document.createElementNS(odrlNS, 'o:constraint', null);
                constraintElem.setAttribute('leftOperand', odrlNS+'spatial');
                constraintElem.setAttribute('operator', odrlNS+geoconstraintoperator);
                constraintElem.setAttribute('rightOperand', geography);
                permissionElem.appendChild(constraintElem);
            }
            if (timeperiodconstraint) {
                var constraintElem = document.createElementNS(odrlNS, 'o:constraint', null);
                constraintElem.setAttribute('leftOperand', odrlNS+'dateTime');
                constraintElem.setAttribute('operator', odrlNS+beforeafteroperator);
                constraintElem.setAttribute('rightOperand', constraintdate);
                constraintElem.setAttribute('datatype', 'xs:date');
                rightsmlDoc.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xs', 'http://www.w3.org/2001/XMLSchema');

                permissionElem.appendChild(constraintElem);
            }
            xmlDoc.documentElement.appendChild(permissionElem);

            /* turn XML object into string */
            // var serializer = new XMLSerializer();
            var xmlString = (new XMLSerializer()).serializeToString(xmlDoc);
            xmlString = this.xmlpretty(xmlString, 1);
            const xmlDecl = '<?xml version="1.0" encoding="UTF-8"?>'
            var xmlDocAsString =  xmlDecl + '\n' + xmlString.toString();
            return(xmlDocAsString);
        } else if (this.state.outputformat == 'turtle') {
            return("Turtle output not yet implemented.");
        } else if (this.state.outputformat == 'jsonld') {
            
            var permissionobj = {};
            if (targetasseturi) {
                permissionobj["target"] = targetasseturi;
            }
            if (assigneruri) {
                permissionobj["assigner"] = assigneruri;
            }
            if (assigneeuri) {
                if (assigneeIsPartyCollection) {
                    permissionobj["assignee"] = {
                        "@type": "PartyCollection",
                        "uid": assigneeuri
                    }
                } else {
                    permissionobj["assignee"] = assigneeuri;
                }
            }
            if (actionuri) {
                permissionobj["action"] = actionuri;
            }
            var constraints = []
            if (geoconstraint) {
                constraints.push({
                    "leftOperand": "spatial",
                    "operator": geoconstraintoperator,
                    "rightOperand": geography
                });
            }
            if (timeperiodconstraint) {
                constraints.push({
                    "leftOperand": "dateTime",
                    "operator": beforeafteroperator,
                    "rightOperand": { "@value": constraintdate, "@type": "xsd:date" }
                });
            }
            if (constraints) {
                permissionobj["constraint"] = constraints;
            }
            var permission = [ permissionobj ];
/*
                "action": "grantUse",
                "constraint": [{
                    "leftOperand": "spatial",
                    "operator": "eq",
                    "rightOperand": "http://cvx.iptc.org/iso3166-1a3/ITA"
                }],
                "duty": [{
                    "target": "http://epa.eu/cv/policy/3",
                    "action": "nextPolicy"
                }]
*/
            var jsonoutput = {
                "@context": ["http://www.w3.org/ns/odrl.jsonld", 
                    "https://iptc.org/std/RightsML/odrl-profile/rightsml.jsonld"],
                "@type": "Set",
                "uid": policyguid,
                "profile": rightsmlProfile,
                "permission": permission
            }
            return(JSON.stringify(jsonoutput, null, 2));
            // return("JSON-LD output not yet implemented.");
        }
    }
    handleSubmit(event) {
        /* there's no submit button but just in case some automatic feature tries to submit the form... */
        event.preventDefault();
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked
            : target.type === 'select-multiple' ? [...target.selectedOptions].map(o => o.value)
            : target.value;
        const name = target.name;
        console.log("Setting "+name+" to "+value);
        // setState is asynchronous so we update the output after completion using the callback
        this.setState({
            [name]: value
        }, this.refreshOutput);
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
                <div className="form-row">
                    <b className="col-sm-12">Generic properties</b>
                </div>
                <div className="form-row">
                    <label className="col-sm-4 col-form-label" htmlFor="subheadline">Target Asset URI</label>
                    <div className="col-sm-8">
                        <input className="form-control form-control-sm" type="text" id="subheadline" name="targetasseturi" size="40" title="Target Asset URI" value={this.state.targetasseturi} onChange={this.handleInputChange} tabIndex="8" />
                    </div>
                </div>
                <div className="form-row">
                    <label className="col-sm-4 col-form-label" htmlFor="provider">Assignee can...</label>
                    <div className="col-sm-8">
                        <select className="form-control form-control-sm" id="actionuri" name="actionuri" size="1" width="25" title="Select the applicable action" value={this.state.actionuri} onChange={this.handleInputChange} tabIndex="7">
                            <option value="">Choose an action type</option>
                            <option value="http://www.w3.org/ns/odrl/2/distribute">Distribute</option>
                            <option value="http://www.w3.org/ns/odrl/2/present">Present</option>
                            <option value="http://www.w3.org/ns/odrl/2/archive">Archive</option>
                            <option value="http://www.w3.org/ns/odrl/2/index">Index</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <label className="col-sm-4 col-form-label" htmlFor="assigneruri">Assigner (URI)</label>
                    <div className="col-sm-8">
                        <input className="form-control form-control-sm" type="text" id="assigneruri" name="assigneruri" size="40" title="Assigner URI" value={this.state.assigneruri} onChange={this.handleInputChange} tabIndex="13" />
                    </div>
                </div>
                <div className="form-row">
                    <label className="col-sm-4 col-form-label" htmlFor="assigneeuri">Assignee (URI)</label>
                    <div className="col-sm-8">
                        <input className="form-control form-control-sm" type="text" id="assigneeuri" name="assigneeuri" size="40" title="Assignee URI" value={this.state.assigneeuri} onChange={this.handleInputChange}  tabIndex="14" />
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="checkbox" id="assigneeIsPartyCollection" name="assigneeIsPartyCollection" value={this.state.assigneeIsPartyCollection} onChange={this.handleInputChange} tabIndex="15" />
                          <label className="form-check-label" htmlFor="assigneeIsPartyCollection">Assignee is a group (PartyCollection)</label>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <b className="col-sm-12">Constraints</b>
                </div>
                <div className="form-row">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="geo" name="geoconstraint" value={this.state.geoconstraint} onChange={this.handleInputChange} tabIndex="7" />
                        <label className="form-check-label" htmlFor="geo">Geographic constraint</label>
                    </div>
                </div>
                 <div className="form-row">
                    <label className="col-sm-4 col-form-label" htmlFor="provider">Geography</label>
                    <div className="col-sm-8">
                        <select className="form-control form-control-sm" id="geography" name="geography" size="1" width="25" title="Select the applicable geography" value={this.state.geography} onChange={this.handleInputChange} tabIndex="7">
                            <option value="">Choose a geography</option>
                            <option value="http://cvx.iptc.org/iso3166-1a3/CHN">China</option>
                            <option value="http://cvx.iptc.org/iso3166-1a3/DEU">Germany</option>
                            <option value="http://cvx.iptc.org/iso3166-1a3/GBR">UK</option>
                            <option value="http://cvx.iptc.org/iso3166-1a3/USA">USA</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-sm-4">&nbsp;</div>
                    <div className="col-sm-8">
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" id="geoinclude" name="geoincludeexclude" value="include" title="Include geography" onChange={this.handleInputChange} tabIndex="8" />
                          <label className="form-check-label" htmlFor="geoinclude">Include</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" id="geoexclude" defaultChecked name="geoincludeexclude" value="exclude" title="Exclude geography" onChange={this.handleInputChange} tabIndex="9" />
                          <label className="form-check-label" htmlFor="geoexclude">Exclude</label>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="timeperiod" name="timeperiodconstraint" value={this.state.timeperiodconstraint} onChange={this.handleInputChange} tabIndex="7" />
                        <label className="form-check-label" htmlFor="timeperiod">Time period constraint</label>
                    </div>
                </div>
                <div className="form-row">
                    <label className="col-sm-4 col-form-label" htmlFor="constraintdate">Date</label>
                    <div className="col-sm-8">
                        <input className="form-control form-control-sm" type="date" id="constraintdate" name="constraintdate" title="Constraint Date" value={this.state.constraintdate} onChange={this.handleInputChange} tabIndex="13" />
                    </div>
                </div>
                <div className="form-row">
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
           </div>
        <div className="col">
            <div className="outputbox">
                <legend>{outputtext} <a href="#" className="btn btn-primary" role="button" onClick={this.copyToClipboard}>Copy to clipboard <i className="fas fa-copy" /></a></legend>
                <div className="form-row">
                    <div className="col-sm-4">
                        Choose output format:
                    </div>
                    <div className="col-sm-8">
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="outputformat" id="turtle" value="turtle" title="Output format - Turtle" onChange={this.handleInputChange} tabIndex="21" />&nbsp;
                            <label className="form-check-label" htmlFor="turtle">Turtle</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" defaultChecked name="outputformat" id="jsonld" value="jsonld" title="Output format - JSON-LD" onChange={this.handleInputChange} tabIndex="22" />&nbsp;
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
