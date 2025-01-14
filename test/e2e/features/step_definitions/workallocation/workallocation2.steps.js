
var { defineSupportCode } = require('cucumber');

const headerPage = require('../../pageObjects/headerPage');
const myWorkPage = require('../../pageObjects/workAllocation/myWorkPage');
const BrowserWaits = require('../../../support/customWaits');

defineSupportCode(function ({ And, But, Given, Then, When }) {


    When('I navigate to My work sub navigation tab {string}', async function (secondaryNavTab) {
        await headerPage.clickPrimaryNavigationWithLabel('My work');
        await myWorkPage.clickSubNavigationTab(secondaryNavTab);
       
    });

    Then('I validate My work sub navigations displayed', async function(datatable){
        const tabshashes = datatable.hashes();
        for(let i = 0; i < tabshashes.length;i++){
            expect(await myWorkPage.isSubNavigationTabPresent(tabshashes[i]['Tab'])).to.be.true
        }
    });

    When('I click My work sub navigation tab {string}', async function(subNavTab){
        await myWorkPage.clickSubNavigationTab(subNavTab);
    });

    Then('I validate I am on My work page', async function(){
        expect(await myWorkPage.amOnPage()).to.be.true
    });

    Then('I see work filter button displayed', async function () {
        expect(await myWorkPage.showHideWorkFilterBtn.isDisplayed()).to.be.true
    });

    Then('I validate work filter button text is {string}', async function (btntext) {
        expect(await myWorkPage.showHideWorkFilterBtn.getText()).to.include(btntext);
    });

    When('I click work filter button', async function () {
        await myWorkPage.showHideWorkFilterBtn.click();
    });

    Then('I validate location filter is displayed', async function () {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await myWorkPage.genericFilterContainer.isPresent()).to.be.true;;
        }); 
    });

    Then('I validate location filter is not displayed', async function () {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await myWorkPage.genericFilterContainer.isPresent(),'location filter is still displayed').to.be.false;;
        });
        
    });

    Then('I validate My work filter locations displayed', async function () {
        await myWorkPage.waitForWorkFilterToDisplay();
        expect(await myWorkPage.getWorkFilterLocationsCount() > 0,'No location inputs displayed').to.be.true;;
    });

    Then('I validate work locations selected count is {int}', async function (selectedLocationsCount) {
        await myWorkPage.waitForWorkFilterToDisplay();
        const selectedLocs = await myWorkPage.getListOfSelectedLocations();
        expect(selectedLocs.length,'selected locations count not matching').to.equal(selectedLocationsCount);

    });

    When('I click work location filter with label {string}', async function(workLocationLabel){
        await myWorkPage.waitForWorkFilterToDisplay();
        await myWorkPage.clickWorkFilterLoctionInputWithLabel(workLocationLabel);
    });

    Then('I validate following work location selected', async function(locationsDatatable){
        const selectedLocations = await myWorkPage.getListOfSelectedLocations();
        const locationNameHashes = locationsDatatable.hashes();
        const locationNamesArr = [];
        for (let i = 0; i < locationNameHashes.length; i++){
            locationNamesArr.push(locationNameHashes[i].locationName);
        }
        expect(selectedLocations, 'actual missing expected locations').to.have.same.members(locationNamesArr);
        //expect(locationNamesArr,'actual has more locations selected').to.include.all.members(selectedLocations);
        

    });

    When('I click work location filter Apply button', async function(){
        await myWorkPage.waitForWorkFilterToDisplay();
        await myWorkPage.workFilterApplyBtn.click();
    });

    When('I click work location filter Reset button', async function(){
        await myWorkPage.waitForWorkFilterToDisplay();
        await myWorkPage.workFilterRestBtn.click();
    });

    Then('I validate work location filter batch and hint labels are displayed', async function(){
        expect(await myWorkPage.showHideFilterBadge.isPresent()).to.be.true;
        expect(await myWorkPage.showHideFilterHint.isPresent()).to.be.true;
    });

    Then('I validate work location filter batch and hint labels are not displayed', async function () {
        expect(await myWorkPage.showHideFilterBadge.isPresent()).to.be.false;
        expect(await myWorkPage.showHideFilterHint.isPresent()).to.be.false;
    });

    When('I click My work sub navigation tab {string}', async function(subNavTabLabel){
        await myWorkPage.clickSubNavigationTab(subNavTabLabel);
    });



});