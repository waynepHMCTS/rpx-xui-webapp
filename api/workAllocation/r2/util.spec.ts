import { getWATaskActionsForCancel, getWATaskActionsForExecute, getWATaskActionsForManage } from './util';
import { WA_ActionViews } from './constants/actions';
import {expect} from 'chai';

describe('workAllocation util getWATaskActionsForCancel', () => {
    it('isTaskAssinged false', () => {
        const result = getWATaskActionsForCancel(WA_ActionViews.ALL_WORK, false);
        expect(result[0].id).equal('cancel');
        expect(result[0].title).equal('Cancel task');
    });

    it('getWATaskActionsForCancel isTaskAssinged true', () => {
        const result = getWATaskActionsForCancel(WA_ActionViews.ALL_WORK, true);
        expect(result[0].id).equal('cancel');
        expect(result[0].title).equal('Cancel task');
    });
});

describe('workAllocation util getWATaskActionsForExecute', () => {
    it('isTaskAssinged false', () => {
        const result = getWATaskActionsForExecute(WA_ActionViews.ALL_WORK, false);
        expect(result[0].id).equal('complete');
        expect(result[0].title).equal('Mark as done');
    });

    it('getWATaskActionsForCancel isTaskAssinged true', () => {
        const result = getWATaskActionsForExecute(WA_ActionViews.ALL_WORK, true);
        expect(result[0].id).equal('complete');
        expect(result[0].title).equal('Mark as done');
    });
});

describe('workAllocation util', () => {
    it('getWATaskActionsForManage', () => {
        const result = getWATaskActionsForManage(WA_ActionViews.MY, false);
    });
});
