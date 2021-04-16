import { WA_TASK_ACTIONS, WA_ActionViews } from './constants/actions'

export function getWATaskActionsForManage(view: WA_ActionViews, isTaskAssinged: boolean) {
    switch (view) {
        case WA_ActionViews.MY:
          return WA_TASK_ACTIONS.MY;
        case WA_ActionViews.AVAILABLE:
          return WA_TASK_ACTIONS.AVAILABLE;
        case WA_ActionViews.ACTIVE:
          return WA_TASK_ACTIONS.ACTIVE;
        case WA_ActionViews.ALL_WORK:
          return isTaskAssinged ? WA_TASK_ACTIONS.MANAGER.ASSIGNED : WA_TASK_ACTIONS.MANAGER.UNASSIGNED;
        default:
          // If we don't recognise the view, just make sure we at least have an array.
          return []
      }
}

export function getWATaskActionsForExecute(view: WA_ActionViews, isTaskAssinged: boolean) {
  switch (view) {
    case WA_ActionViews.ALL_WORK:
      return isTaskAssinged ? WA_TASK_ACTIONS.ALL_WORK.ASSIGNED : WA_TASK_ACTIONS.ALL_WORK.UNASSIGNED;
    default:
      return [];
  }
}

export function getWATaskActionsForCancel(view: WA_ActionViews, isTaskAssinged: boolean) {
  switch (view) {
    case WA_ActionViews.ALL_WORK:
      return isTaskAssinged ? WA_TASK_ACTIONS.WA_CANCEL.ASSIGNED : WA_TASK_ACTIONS.WA_CANCEL.UNASSIGNED;
    default:
      return [];
  }
}
