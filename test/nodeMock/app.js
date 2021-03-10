const express = require('express');
var bodyParser = require('body-parser');
const minimist = require('minimist');
let {requestMapping} = require('./reqResMapping');
const {browser} = require('protractor');
const CCDCaseConfig = require('./ccd/ccdCaseConfig/caseCreateConfigGenerator');
const CCDCaseDetails = require('./ccd/ccdCaseConfig/caseDetailsConfigGenerator');

const {getDLCaseConfig} = require('../ngIntegration/mockData/ccdCaseMock');

const port = 3001;


class MockApp {
  init() {
    this.intercepts = [];
    this.conf = {
      get: {...requestMapping.get},
      post: {...requestMapping.post},
      put: {...requestMapping.put},
      delete: {...requestMapping.delete}
    };
    // this.configurations = Object.assign({}, configurations);
    console.log("Mock Config Initialized");
    return "done";
  }

  addIntercept(url, callback) {
    this.intercepts.push({url: url, callback: callback})
  }

  async startServer() {
    const app = express();
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(express.json());

    this.intercepts.forEach(intercept => {
      app.use(intercept.url, intercept.callback);
    });

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

  async stopServer() {
    if (this.server) {
      await this.server.close();
      this.server = null;
      console.log("Mock server stopped");

    } else {
      console.log("Mock server is null or undefined");
    }
  }


  onGet(path, callback) {
    this.conf.get[path] = callback;
  }


  onPost(path, callback) {
    this.conf.post[path] = callback;
  }

  onPut(path, callback) {
    this.conf.put[path] = callback;
  }

  onDelete(path, callback) {
    this.conf.delete[path] = callback;
  }

  setConfig(configKey, value) {
    this.configurations[configKey] = value;
  }

}


const mockInstance = new MockApp();
module.exports = mockInstance;

const args = minimist(process.argv)
if (args.standalone) {
  mockInstance.init();
  setUpcaseConfig();
  // getDLCaseConfig();
  // collectionDynamicListeventConfig()
  // createCustomCaseDetails();
  mockInstance.startServer()
}


function setUpcaseConfig(caseConfig) {
  console.log("event create called");

  mockInstance.onGet('/data/internal/cases/:caseid', (req, res) => {

    let caseDetails = new CCDCaseDetails("Mock case");
    console.log("event create called");
    caseDetails
      .addTab("MockCase Tab")
      .addFieldWithConfigToTab({
        id: "collection",
        type: "Collection",
        label: "Collection field",
        collection_field_type: {
          id: "complexField",
          type: "Complex",
          label: "complex field",
          complex_fields: [
            {id: "text", type: "Text", label: "Text field 1"},
            {id: "text2", type: "Text", label: "Text field 2"},
            {id: "text3", type: "Text", label: "Text field 3", show_condition: `text2="sample"`}
          ]
        },
        props: {"display_context_parameter": "#TABLE(text)"},
        value: [
          {
            id: "1234",
            value: {text: "sample test", text2: "sample", text3: 'text3'}
          },
          {
            id: "1233",
            value: {text: "sample test 2", text2: "sample test 2", text3: 'text3'}
          },
          {
            id: "1235",
            value: {text: "sample test 3", text2: "sample test 3", text3: 'text3'}
          },
        ],
      })

    res.send(caseDetails.caseDetailsTemplate);
  });

  // mockInstance.onPost('/data/case-types/:caseType/validate', (req, res) => {
  //     caseValidationRequestBody = req.body;
  //     let pageId = req.query.pageId;
  //     if (pageId === "testPage1"){
  //         caseValidationRequestBody.data.dl2 = { value: { code: "Testitem_1234", label: "Test item 1234" }, list_items: [{ code: "Testitem_1234", label: "Test item 1234" }, { code: "Testitem_12345", label: "Test item 12345" }]}
  //     }
  //     const responseBody = {
  //         data: caseValidationRequestBody.data,
  //         "_links": { "self": { "href": "http://ccd-data-store-api-aat.service.core-compute-demo.internal" + req.path + "?pageId=" + req.query.pageId } }
  //     }
  //     res.send(responseBody);
  // });

  // mockInstance.onPost('/data/cases/:caseid/events', (req, res) => {
  //     caseEventSubmitRequestBody = req.body;
  //     const responseBody = {
  //         id: Date.now(),
  //         data: req.body.data,
  //         "_links": { "self": { "href": "http://ccd-data-store-api-demo.service.core-compute-demo.internal" + req.path + "?ignore-warning=false" } }
  //     }
  //     res.send(responseBody)
  // });

}


