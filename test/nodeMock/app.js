

const express = require('express');
var bodyParser = require('body-parser');

let { requestMapping,configurations} = require('./reqResMapping');
const { browser } = require('protractor');
const CCDCaseConfig = require('./ccd/ccdCaseConfig/caseCreateConfigGenerator')
const port = 3001;


class MockApp{
    init(){
        this.conf = {
            get: { ...requestMapping.get },
            post: { ...requestMapping.post },
            put: { ...requestMapping.put },
            delete: { ...requestMapping.delete }
        };
        this.configurations = Object.assign({}, configurations);
        console.log("Mock Config Initialized");
        return "done";
    }

    async startServer(){
        const app = express();
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(express.json()) 
        for (const [key, value] of Object.entries(this.conf.get)) {
            app.get(key, value);
        }

        for (const [key, value] of Object.entries(this.conf.post)) {
            app.post(key, value);
        }

        for (const [key, value] of Object.entries(this.conf.put)) {
            app.put(key, value);
        }

        for (const [key, value] of Object.entries(this.conf.delete)) {
            app.delete(key, value);
        }

        this.server = await app.listen(port)
        console.log("mock api started");
        // return "Mock started successfully"

    }

    async stopServer(){
        if (this.server){
            await this.server.close();
            this.server = null;
        }else{
            console.log("Mock server is null or undefined");
        }
        this.conf = {  };
        this.configurations = { };
    }

   
    onGet(path, callback){
        this.conf.get[path] = callback; 
    }


    onPost(path, callback){
        this.conf.post[path] = callback; 
    }

    onPut(path, callback){
        this.conf.put[path] = callback; 
    }

    onDelete(path, callback){
        this.conf.delete[path] = callback; 
    }

    setConfig(configKey,value){
       this.configurations[configKey] = value; 
    }

}

const mockInstance = new MockApp();
module.exports = mockInstance;


mockInstance.init();
createCustomCCDCaseConfig();
mockInstance.startServer();



function createCustomCCDCaseConfig(){
    // const scenario = { fieldType: "Collection", showField: false, retainHiddenField: false };

    const scenario = { fieldType: "Document", showField: false, retainHiddenField: true };

    const caseConfig = new CCDCaseConfig('TEST_CaseType', 'Demo Test', 'test demo description');
    const page1 = caseConfig.addWizardPage('HiddenFieldPage_1', 'Demo to Paul G');


    let collectiobField = caseConfig.addCCDFieldToPage(page1, "Collection", "collectioOfDates", "Colletion Dates for Test");
 
    collectiobField.field_type.collection_field_type= caseConfig.getCCDFieldTemplateCopy("Date", "collectionDateItem", "Dates value").field_type;
    collectiobField.acls = [{
        "role": "caseworker-divorce-solicitor",
        "create": true,
        "read": true,
        "update": true,
        "delete": false
    }];

    setUpcaseConfig(caseConfig.caseConfigTemplate);
}


function setUpcaseConfig(caseConfig) {
    mockInstance.onGet('/data/internal/cases/:caseid/event-triggers/:eventId', (req, res) => {
        res.send(caseConfig);
    });

    mockInstance.onPost('/data/case-types/:caseType/validate', (req, res) => {
        caseValidationRequestBody = req.body;
        const responseBody = {
            data: req.body.data,
            "_links": { "self": { "href": "http://ccd-data-store-api-aat.service.core-compute-demo.internal" + req.path + "?pageId=" + req.query.pageId } }
        }
        res.send(responseBody);
    });

    mockInstance.onPost('/data/cases/:caseid/events', (req, res) => {
        caseEventSubmitRequestBody = req.body;
        const responseBody = {
            id: Date.now(),
            data: req.body.data,
            "_links": { "self": { "href": "http://ccd-data-store-api-demo.service.core-compute-demo.internal" + req.path + "?ignore-warning=false" } }
        }
        res.send(responseBody)
    });

}


const caseJson = {
    "id": "updateCase",
    "name": "Update case",
    "description": "Update case",
    "case_id": "1606434864159485",
    "case_fields": [
        {
            "id": "DocumentBundle",
            "label": "Document bundle",
            "hidden": null,
            "value": [],
            "metadata": false,
            "hint_text": "Hidden if \"Hide all\" is entered in Text Field 0; value will not be retained",
            "field_type": {
                "id": "DocumentBundle-7a8a78b2-5760-4878-92df-c6122cb3a906",
                "type": "Collection",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [],
                "collection_field_type": {
                    "id": "Document",
                    "type": "Document",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [],
                    "complex_fields": [],
                    "collection_field_type": null
                }
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": [],
            "display_context": "OPTIONAL",
            "display_context_parameter": "#COLLECTION(allowDelete,allowInsert)",
            "show_condition": "TextField0!=\"Hide all\"",
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": null,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        },
        {
            "id": "CaseLink1",
            "label": "Case Link 1",
            "hidden": null,
            "value": {
                "CaseReference": ""
            },
            "metadata": false,
            "hint_text": "Hidden if \"Hide all\" is entered in Text Field 0; value will not be retained",
            "field_type": {
                "id": "CaseLink",
                "type": "Complex",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [
                    {
                        "id": "CaseReference",
                        "label": "Case Reference",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextCaseReference",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": "(?:^[0-9]{16}$|^\\d{4}-\\d{4}-\\d{4}-\\d{4}$)",
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    }
                ],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": {
                "CaseReference": ""
            },
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": "TextField0!=\"Hide all\"",
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": true,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        },
        {
            "id": "Organisation1",
            "label": "Organisation 1",
            "hidden": null,
            "value": {
                "OrganisationID": null,
                "OrganisationName": null
            },
            "metadata": false,
            "hint_text": "Hidden if \"Hide all\" is entered in Text Field 0; value will not be retained",
            "field_type": {
                "id": "Organisation",
                "type": "Complex",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [
                    {
                        "id": "OrganisationID",
                        "label": "Organisation ID",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "OrganisationName",
                        "label": "Name",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    }
                ],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": {
                "OrganisationID": null,
                "OrganisationName": null
            },
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": "TextField0!=\"Hide all\"",
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": true,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        },
        {
            "id": "AddressUK1",
            "label": "Address UK 1",
            "hidden": null,
            "value": {
                "County": null,
                "Country": null,
                "PostCode": null,
                "PostTown": null,
                "AddressLine1": null,
                "AddressLine2": null,
                "AddressLine3": null
            },
            "metadata": false,
            "hint_text": "Hidden if \"Hide all\" is entered in Text Field 0; value will not be retained",
            "field_type": {
                "id": "AddressUK",
                "type": "Complex",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [
                    {
                        "id": "AddressLine1",
                        "label": "Building and Street",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax150",
                            "type": "Text",
                            "min": null,
                            "max": 150,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "AddressLine2",
                        "label": "Address Line 2",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax50",
                            "type": "Text",
                            "min": null,
                            "max": 50,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "AddressLine3",
                        "label": "Address Line 3",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax50",
                            "type": "Text",
                            "min": null,
                            "max": 50,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "PostTown",
                        "label": "Town or City",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax50",
                            "type": "Text",
                            "min": null,
                            "max": 50,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "County",
                        "label": "County",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax50",
                            "type": "Text",
                            "min": null,
                            "max": 50,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "PostCode",
                        "label": "Postcode/Zipcode",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax14",
                            "type": "Text",
                            "min": null,
                            "max": 14,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "Country",
                        "label": "Country",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax50",
                            "type": "Text",
                            "min": null,
                            "max": 50,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    }
                ],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": {
                "County": null,
                "Country": null,
                "PostCode": null,
                "PostTown": null,
                "AddressLine1": null,
                "AddressLine2": null,
                "AddressLine3": null
            },
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": "TextField0!=\"Hide all\"",
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": true,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        },
        {
            "id": "AddressGlobalUK1",
            "label": "Address Global UK 1",
            "hidden": null,
            "value": {
                "County": null,
                "Country": null,
                "PostCode": null,
                "PostTown": null,
                "AddressLine1": null,
                "AddressLine2": null,
                "AddressLine3": null
            },
            "metadata": false,
            "hint_text": "Hidden if \"Hide all\" is entered in Text Field 0; value will not be retained",
            "field_type": {
                "id": "AddressGlobalUK",
                "type": "Complex",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [
                    {
                        "id": "AddressLine1",
                        "label": "Building and Street",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax150",
                            "type": "Text",
                            "min": null,
                            "max": 150,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "AddressLine2",
                        "label": "Address Line 2",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax50",
                            "type": "Text",
                            "min": null,
                            "max": 50,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "AddressLine3",
                        "label": "Address Line 3",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax50",
                            "type": "Text",
                            "min": null,
                            "max": 50,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "PostTown",
                        "label": "Town or City",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax50",
                            "type": "Text",
                            "min": null,
                            "max": 50,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "County",
                        "label": "County/State",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax50",
                            "type": "Text",
                            "min": null,
                            "max": 50,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "Country",
                        "label": "Country",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax50",
                            "type": "Text",
                            "min": null,
                            "max": 50,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "PostCode",
                        "label": "Postcode/Zipcode",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax14",
                            "type": "Text",
                            "min": null,
                            "max": 14,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    }
                ],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": {
                "County": null,
                "Country": null,
                "PostCode": null,
                "PostTown": null,
                "AddressLine1": null,
                "AddressLine2": null,
                "AddressLine3": null
            },
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": "TextField0!=\"Hide all\"",
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": true,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        },
        {
            "id": "AddressGlobal1",
            "label": "Address Global 1",
            "hidden": null,
            "value": {
                "County": null,
                "Country": null,
                "PostCode": null,
                "PostTown": null,
                "AddressLine1": null,
                "AddressLine2": null,
                "AddressLine3": null
            },
            "metadata": false,
            "hint_text": "Hidden if \"Hide all\" is entered in Text Field 0; value will not be retained",
            "field_type": {
                "id": "AddressGlobal",
                "type": "Complex",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [
                    {
                        "id": "AddressLine1",
                        "label": "Building and Street",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax150",
                            "type": "Text",
                            "min": null,
                            "max": 150,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "AddressLine2",
                        "label": "Address Line 2",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax50",
                            "type": "Text",
                            "min": null,
                            "max": 50,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "AddressLine3",
                        "label": "Address Line 3",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax50",
                            "type": "Text",
                            "min": null,
                            "max": 50,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "PostTown",
                        "label": "Town or City",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax50",
                            "type": "Text",
                            "min": null,
                            "max": 50,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "County",
                        "label": "County/State",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax50",
                            "type": "Text",
                            "min": null,
                            "max": 50,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "Country",
                        "label": "Country",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax50",
                            "type": "Text",
                            "min": null,
                            "max": 50,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "PostCode",
                        "label": "Postcode/Zipcode",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "TextMax14",
                            "type": "Text",
                            "min": null,
                            "max": 14,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    }
                ],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": {
                "County": null,
                "Country": null,
                "PostCode": null,
                "PostTown": null,
                "AddressLine1": null,
                "AddressLine2": null,
                "AddressLine3": null
            },
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": "TextField0!=\"Hide all\"",
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": true,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        },
        {
            "id": "DocumentUrl",
            "label": "Document 1",
            "hidden": null,
            "value": null,
            "metadata": false,
            "hint_text": "Hidden if \"Hide all\" is entered in Text Field 0; value will not be retained",
            "field_type": {
                "id": "Document",
                "type": "Document",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": null,
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": "TextField0!=\"Hide all\"",
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": null,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        },
        {
            "id": "DivorceReason",
            "label": "Choose divorce reasons",
            "hidden": null,
            "value": [],
            "metadata": false,
            "hint_text": "Hidden if \"Hide all\" is entered in Text Field 0; value will not be retained",
            "field_type": {
                "id": "MultiSelectList-reasonForDivorceEnum",
                "type": "MultiSelectList",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [
                    {
                        "code": "separation-5-years",
                        "label": "5-year separation",
                        "order": null
                    },
                    {
                        "code": "separation-2-years",
                        "label": "2-year separation (with consent)",
                        "order": null
                    },
                    {
                        "code": "desertion",
                        "label": "Desertion",
                        "order": null
                    },
                    {
                        "code": "adultery",
                        "label": "Adultery",
                        "order": null
                    },
                    {
                        "code": "unreasonable-behaviour",
                        "label": "Behaviour",
                        "order": null
                    }
                ],
                "complex_fields": [],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": [],
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": "TextField0!=\"Hide all\"",
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": null,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        },
        {
            "id": "People",
            "label": "Group of People",
            "hidden": null,
            "value": [],
            "metadata": false,
            "hint_text": "Hidden if \"Hide all\" is entered in Text Field 0; value will not be retained",
            "field_type": {
                "id": "People-1754749b-7360-47cc-ba91-f33274e9033d",
                "type": "Collection",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [],
                "collection_field_type": {
                    "id": "Person",
                    "type": "Complex",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [],
                    "complex_fields": [
                        {
                            "id": "Title",
                            "label": "Title",
                            "hidden": null,
                            "order": null,
                            "metadata": false,
                            "case_type_id": null,
                            "hint_text": null,
                            "field_type": {
                                "id": "Text",
                                "type": "Text",
                                "min": null,
                                "max": null,
                                "regular_expression": null,
                                "fixed_list_items": [],
                                "complex_fields": [],
                                "collection_field_type": null
                            },
                            "security_classification": "PUBLIC",
                            "live_from": null,
                            "live_until": null,
                            "show_condition": null,
                            "acls": [
                                {
                                    "role": "caseworker-divorce-solicitor",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "caseworker-divorce-superuser",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "caseworker-caa",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "pui-caa",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null
                        },
                        {
                            "id": "FirstName",
                            "label": "First Name",
                            "hidden": null,
                            "order": null,
                            "metadata": false,
                            "case_type_id": null,
                            "hint_text": null,
                            "field_type": {
                                "id": "Text",
                                "type": "Text",
                                "min": null,
                                "max": null,
                                "regular_expression": null,
                                "fixed_list_items": [],
                                "complex_fields": [],
                                "collection_field_type": null
                            },
                            "security_classification": "PUBLIC",
                            "live_from": null,
                            "live_until": null,
                            "show_condition": null,
                            "acls": [
                                {
                                    "role": "caseworker-divorce-solicitor",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "caseworker-divorce-superuser",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "caseworker-caa",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "pui-caa",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null
                        },
                        {
                            "id": "LastName",
                            "label": "Last Name",
                            "hidden": null,
                            "order": null,
                            "metadata": false,
                            "case_type_id": null,
                            "hint_text": null,
                            "field_type": {
                                "id": "Text",
                                "type": "Text",
                                "min": null,
                                "max": null,
                                "regular_expression": null,
                                "fixed_list_items": [],
                                "complex_fields": [],
                                "collection_field_type": null
                            },
                            "security_classification": "PUBLIC",
                            "live_from": null,
                            "live_until": null,
                            "show_condition": null,
                            "acls": [
                                {
                                    "role": "caseworker-divorce-solicitor",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "caseworker-divorce-superuser",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "caseworker-caa",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "pui-caa",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null
                        },
                        {
                            "id": "MaidenName",
                            "label": "Maiden Name",
                            "hidden": null,
                            "order": null,
                            "metadata": false,
                            "case_type_id": null,
                            "hint_text": null,
                            "field_type": {
                                "id": "Text",
                                "type": "Text",
                                "min": null,
                                "max": null,
                                "regular_expression": null,
                                "fixed_list_items": [],
                                "complex_fields": [],
                                "collection_field_type": null
                            },
                            "security_classification": "PUBLIC",
                            "live_from": null,
                            "live_until": null,
                            "show_condition": "PersonGender=\"female\"",
                            "acls": [
                                {
                                    "role": "caseworker-divorce-solicitor",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "caseworker-divorce-superuser",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "caseworker-caa",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "pui-caa",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": true,
                            "formatted_value": null
                        },
                        {
                            "id": "PersonGender",
                            "label": "Gender",
                            "hidden": null,
                            "order": null,
                            "metadata": false,
                            "case_type_id": null,
                            "hint_text": null,
                            "field_type": {
                                "id": "FixedList-gender",
                                "type": "FixedList",
                                "min": null,
                                "max": null,
                                "regular_expression": null,
                                "fixed_list_items": [
                                    {
                                        "code": "notGiven",
                                        "label": "Not given",
                                        "order": null
                                    },
                                    {
                                        "code": "female",
                                        "label": "Female",
                                        "order": null
                                    },
                                    {
                                        "code": "male",
                                        "label": "Male",
                                        "order": null
                                    }
                                ],
                                "complex_fields": [],
                                "collection_field_type": null
                            },
                            "security_classification": "PUBLIC",
                            "live_from": null,
                            "live_until": null,
                            "show_condition": null,
                            "acls": [
                                {
                                    "role": "caseworker-divorce-solicitor",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "caseworker-divorce-superuser",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "caseworker-caa",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "pui-caa",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null
                        },
                        {
                            "id": "PersonJob",
                            "label": "Job",
                            "hidden": null,
                            "order": null,
                            "metadata": false,
                            "case_type_id": null,
                            "hint_text": null,
                            "field_type": {
                                "id": "Job",
                                "type": "Complex",
                                "min": null,
                                "max": null,
                                "regular_expression": null,
                                "fixed_list_items": [],
                                "complex_fields": [
                                    {
                                        "id": "Title",
                                        "label": "Title",
                                        "hidden": null,
                                        "order": null,
                                        "metadata": false,
                                        "case_type_id": null,
                                        "hint_text": null,
                                        "field_type": {
                                            "id": "Text",
                                            "type": "Text",
                                            "min": null,
                                            "max": null,
                                            "regular_expression": null,
                                            "fixed_list_items": [],
                                            "complex_fields": [],
                                            "collection_field_type": null
                                        },
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "role": "caseworker-divorce-solicitor",
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": true
                                            },
                                            {
                                                "role": "caseworker-divorce-superuser",
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": true
                                            },
                                            {
                                                "role": "caseworker-caa",
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": true
                                            },
                                            {
                                                "role": "pui-caa",
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": true
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": null,
                                        "formatted_value": null
                                    },
                                    {
                                        "id": "Description",
                                        "label": "Description",
                                        "hidden": null,
                                        "order": null,
                                        "metadata": false,
                                        "case_type_id": null,
                                        "hint_text": null,
                                        "field_type": {
                                            "id": "Text",
                                            "type": "Text",
                                            "min": null,
                                            "max": null,
                                            "regular_expression": null,
                                            "fixed_list_items": [],
                                            "complex_fields": [],
                                            "collection_field_type": null
                                        },
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": "Title!=\"\"",
                                        "acls": [
                                            {
                                                "role": "caseworker-divorce-solicitor",
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": true
                                            },
                                            {
                                                "role": "caseworker-divorce-superuser",
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": true
                                            },
                                            {
                                                "role": "caseworker-caa",
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": true
                                            },
                                            {
                                                "role": "pui-caa",
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": true
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": null,
                                        "formatted_value": null
                                    }
                                ],
                                "collection_field_type": null
                            },
                            "security_classification": "PUBLIC",
                            "live_from": null,
                            "live_until": null,
                            "show_condition": "LastName!=\"\"",
                            "acls": [
                                {
                                    "role": "caseworker-divorce-solicitor",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "caseworker-divorce-superuser",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "caseworker-caa",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                },
                                {
                                    "role": "pui-caa",
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": true,
                            "formatted_value": null
                        }
                    ],
                    "collection_field_type": null
                }
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": [],
            "display_context": "OPTIONAL",
            "display_context_parameter": "#COLLECTION(allowDelete,allowInsert)",
            "show_condition": "TextField0!=\"Hide all\"",
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": null,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        },
        {
            "id": "Person2",
            "label": "Person 2 - not retained",
            "hidden": null,
            "value": {
                "Title": "title",
                "LastName": "ln",
                "FirstName": "fn",
                "PersonJob": {
                    "Title": "title",
                    "Description": "desc"
                },
                "MaidenName": null,
                "PersonGender": null
            },
            "metadata": false,
            "hint_text": "Hidden if \"Hide all\" is entered in Text Field 0; value will not be retained",
            "field_type": {
                "id": "Person",
                "type": "Complex",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [
                    {
                        "id": "Title",
                        "label": "Title",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "FirstName",
                        "label": "First Name",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "LastName",
                        "label": "Last Name",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "MaidenName",
                        "label": "Maiden Name",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": "PersonGender=\"female\"",
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": true,
                        "formatted_value": null
                    },
                    {
                        "id": "PersonGender",
                        "label": "Gender",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "FixedList-gender",
                            "type": "FixedList",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [
                                {
                                    "code": "notGiven",
                                    "label": "Not given",
                                    "order": null
                                },
                                {
                                    "code": "female",
                                    "label": "Female",
                                    "order": null
                                },
                                {
                                    "code": "male",
                                    "label": "Male",
                                    "order": null
                                }
                            ],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "PersonJob",
                        "label": "Job",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "Job",
                            "type": "Complex",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [
                                {
                                    "id": "Title",
                                    "label": "Title",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "Text",
                                        "type": "Text",
                                        "min": null,
                                        "max": null,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": [
                                        {
                                            "role": "caseworker-divorce-solicitor",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        },
                                        {
                                            "role": "caseworker-divorce-superuser",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        },
                                        {
                                            "role": "caseworker-caa",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        },
                                        {
                                            "role": "pui-caa",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        }
                                    ],
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null
                                },
                                {
                                    "id": "Description",
                                    "label": "Description",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "Text",
                                        "type": "Text",
                                        "min": null,
                                        "max": null,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": "Title!=\"\"",
                                    "acls": [
                                        {
                                            "role": "caseworker-divorce-solicitor",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        },
                                        {
                                            "role": "caseworker-divorce-superuser",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        },
                                        {
                                            "role": "caseworker-caa",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        },
                                        {
                                            "role": "pui-caa",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        }
                                    ],
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null
                                }
                            ],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": "LastName!=\"\"",
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": true,
                        "formatted_value": null
                    }
                ],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": {
                "Title": null,
                "LastName": null,
                "FirstName": null,
                "PersonJob": {
                    "Title": null,
                    "Description": null
                },
                "MaidenName": null,
                "PersonGender": null
            },
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": "TextField0!=\"Hide all\"",
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": null,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        },
        {
            "id": "Person1",
            "label": "Person 1 - retained",
            "hidden": null,
            "value": {
                "Title": "title",
                "LastName": "ln",
                "FirstName": "fn",
                "PersonJob": {
                    "Title": "title",
                    "Description": "desc"
                },
                "MaidenName": "old",
                "PersonGender": null
            },
            "metadata": false,
            "hint_text": "Hidden if \"Hide all\" is entered in Text Field 0; value will be retained",
            "field_type": {
                "id": "Person",
                "type": "Complex",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [
                    {
                        "id": "Title",
                        "label": "Title",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "FirstName",
                        "label": "First Name",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "LastName",
                        "label": "Last Name",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "MaidenName",
                        "label": "Maiden Name",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": "PersonGender=\"female\"",
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": true,
                        "formatted_value": null
                    },
                    {
                        "id": "PersonGender",
                        "label": "Gender",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "FixedList-gender",
                            "type": "FixedList",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [
                                {
                                    "code": "notGiven",
                                    "label": "Not given",
                                    "order": null
                                },
                                {
                                    "code": "female",
                                    "label": "Female",
                                    "order": null
                                },
                                {
                                    "code": "male",
                                    "label": "Male",
                                    "order": null
                                }
                            ],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": null,
                        "formatted_value": null
                    },
                    {
                        "id": "PersonJob",
                        "label": "Job",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "Job",
                            "type": "Complex",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [
                                {
                                    "id": "Title",
                                    "label": "Title",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "Text",
                                        "type": "Text",
                                        "min": null,
                                        "max": null,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": [
                                        {
                                            "role": "caseworker-divorce-solicitor",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        },
                                        {
                                            "role": "caseworker-divorce-superuser",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        },
                                        {
                                            "role": "caseworker-caa",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        },
                                        {
                                            "role": "pui-caa",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        }
                                    ],
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null
                                },
                                {
                                    "id": "Description",
                                    "label": "Description",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "Text",
                                        "type": "Text",
                                        "min": null,
                                        "max": null,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": "Title!=\"\"",
                                    "acls": [
                                        {
                                            "role": "caseworker-divorce-solicitor",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        },
                                        {
                                            "role": "caseworker-divorce-superuser",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        },
                                        {
                                            "role": "caseworker-caa",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        },
                                        {
                                            "role": "pui-caa",
                                            "create": true,
                                            "read": true,
                                            "update": true,
                                            "delete": true
                                        }
                                    ],
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null
                                }
                            ],
                            "collection_field_type": null
                        },
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": "LastName!=\"\"",
                        "acls": [
                            {
                                "role": "caseworker-divorce-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-divorce-superuser",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            },
                            {
                                "role": "pui-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": true
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": true,
                        "formatted_value": null
                    }
                ],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": {
                "Title": null,
                "LastName": null,
                "FirstName": null,
                "PersonJob": {
                    "Title": "title",
                    "Description": "desc"
                },
                "MaidenName": null,
                "PersonGender": null
            },
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": "TextField0!=\"Hide all\"",
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": true,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        },
        {
            "id": "Gender",
            "label": "Select your gender",
            "hidden": null,
            "value": null,
            "metadata": false,
            "hint_text": "Hidden if \"Hide all\" is entered in Text Field 0",
            "field_type": {
                "id": "FixedRadioList-gender",
                "type": "FixedRadioList",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [
                    {
                        "code": "notGiven",
                        "label": "Not given",
                        "order": null
                    },
                    {
                        "code": "female",
                        "label": "Female",
                        "order": null
                    },
                    {
                        "code": "male",
                        "label": "Male",
                        "order": null
                    }
                ],
                "complex_fields": [],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": null,
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": "TextField0!=\"Hide all\"",
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": true,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        },
        {
            "id": "TextField3",
            "label": "Text Field 3",
            "hidden": null,
            "value": null,
            "metadata": false,
            "hint_text": null,
            "field_type": {
                "id": "Text",
                "type": "Text",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": null,
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": null,
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": null,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        },
        {
            "id": "TextField2",
            "label": "Text Field 2",
            "hidden": null,
            "value": null,
            "metadata": false,
            "hint_text": "If hidden, this value will be retained",
            "field_type": {
                "id": "Text",
                "type": "Text",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": null,
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": "TextField0!=\"Hide TextField2\" AND TextField0!=\"Hide all\"",
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": true,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        },
        {
            "id": "TextField1",
            "label": "Text Field 1",
            "hidden": null,
            "value": null,
            "metadata": false,
            "hint_text": "If hidden, this value will not be retained",
            "field_type": {
                "id": "Text",
                "type": "Text",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": null,
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": "TextField0!=\"Hide TextField1\" AND TextField0!=\"Hide all\"",
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": null,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        },
        {
            "id": "TextField0",
            "label": "Text Field 0",
            "hidden": null,
            "value": "Hide all",
            "metadata": false,
            "hint_text": "Type \"Hide TextField1\" or \"Hide TextField2\" to hide these optional fields respectively, or \"Hide all\" to hide all fields",
            "field_type": {
                "id": "Text",
                "type": "Text",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": "Hide all",
            "display_context": "MANDATORY",
            "display_context_parameter": null,
            "show_condition": null,
            "show_summary_change_option": true,
            "show_summary_content_option": null,
            "retain_hidden_value": null,
            "acls": [
                {
                    "role": "caseworker-divorce-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-divorce-superuser",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "caseworker-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                },
                {
                    "role": "pui-caa",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                }
            ]
        }
    ],
    "event_token": "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1ZmQwYXNxb3ZyZGUyMDFyNm1tbDcwbm5oYyIsInN1YiI6IjcyZjE2Nzc2LTRmZjktNGY1YS04YjY1LTg2MGU0OTliZDI0ZSIsImlhdCI6MTYwNjQzNTE5MiwiY2FzZS1pZCI6IjM3OTI4IiwiZXZlbnQtaWQiOiJ1cGRhdGVDYXNlIiwiY2FzZS10eXBlLWlkIjoiQ2FzZVZpZXdDYWxsYmFja01lc3NhZ2VzMiIsImp1cmlzZGljdGlvbi1pZCI6IkRJVk9SQ0UiLCJjYXNlLXN0YXRlIjoiQ2FzZUNyZWF0ZWQiLCJjYXNlLXZlcnNpb24iOiI2NzIzZDIwMTkyYmJmNzE0ZmRiMWI2NTZlY2JjMGNiNGExYjM0ODIwIiwiZW50aXR5LXZlcnNpb24iOjF9.nrod_RCL2OSkkiuBTemHREJZ2KQQSjNS6iaEQnof0WI",
    "wizard_pages": [
        {
            "id": "updateCaseSingleFormPage",
            "label": "The data on this page will appear in various tabs",
            "order": 1,
            "wizard_page_fields": [
                {
                    "case_field_id": "TextField0",
                    "order": 1,
                    "page_column_no": null,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "TextField1",
                    "order": 2,
                    "page_column_no": null,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "TextField2",
                    "order": 3,
                    "page_column_no": null,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "Gender",
                    "order": 4,
                    "page_column_no": null,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "Person1",
                    "order": 5,
                    "page_column_no": null,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "Person2",
                    "order": 6,
                    "page_column_no": null,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "People",
                    "order": 7,
                    "page_column_no": null,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "DivorceReason",
                    "order": 8,
                    "page_column_no": null,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "DocumentUrl",
                    "order": 9,
                    "page_column_no": null,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "AddressGlobal1",
                    "order": 10,
                    "page_column_no": null,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "AddressGlobalUK1",
                    "order": 11,
                    "page_column_no": null,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "AddressUK1",
                    "order": 12,
                    "page_column_no": null,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "Organisation1",
                    "order": 13,
                    "page_column_no": null,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "CaseLink1",
                    "order": 14,
                    "page_column_no": null,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "DocumentBundle",
                    "order": 15,
                    "page_column_no": null,
                    "complex_field_overrides": []
                }
            ],
            "show_condition": null,
            "callback_url_mid_event": null,
            "retries_timeout_mid_event": []
        },
        {
            "id": "updateCaseSecondFormPage",
            "label": "Second page of data",
            "order": 2,
            "wizard_page_fields": [
                {
                    "case_field_id": "TextField3",
                    "order": 1,
                    "page_column_no": null,
                    "complex_field_overrides": []
                }
            ],
            "show_condition": null,
            "callback_url_mid_event": null,
            "retries_timeout_mid_event": []
        }
    ],
    "show_summary": false,
    "show_event_notes": false,
    "end_button_label": null,
    "can_save_draft": null,
    "_links": {
        "self": {
            "href": "http://ccd-data-store-api-demo.service.core-compute-demo.internal/internal/cases/1606434864159485/event-triggers/updateCase?ignore-warning=false"
        }
    }
}
