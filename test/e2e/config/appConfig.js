const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

const aatToDemo =  {
    jurisdictions: {
        "Family Divorce": "Family Divorce - v104-26.1",
        "Manage probate application": "Manage probate applications"
    },
    caseType: {
        "XUI Test Case type": "XUI Test Case type",
        "Grant of representation": "Grant of representation"
    }
};

function getJurisdiction(jurisdiction){
    if(argv.demo){
        return aatToDemo.jurisdictions[jurisdiction];
    }else{
        return jurisdiction;
    }
}

function getCaseType(caseType){
    if (argv.demo) {
        return aatToDemo.caseType[caseType];
    } else {
        return caseType;
    }
}

module.exports = { getJurisdiction, getCaseType};