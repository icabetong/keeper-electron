import { Asset } from "./Asset";

export enum ActionType {
  CREATE = "create",
  UPDATE = "update",
  DISMISS = "dismiss"
}

type Action = {
  type: ActionType,
  payload?: Asset
}
type State = {
  asset?: Asset,
  isCreate: boolean,
  isOpen: boolean
}
export const initialState: State = {
  asset: { stockNumber: "", unitValue: 0 },
  isCreate: true,
  isOpen: false,
}
export const reducer = (state: State, action: Action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.CREATE:
      return {
        ...state,
        isCreate: true,
        isOpen: true
      }
    case ActionType.UPDATE:
      return {
        asset: payload,
        isCreate: false,
        isOpen: true
      }
    case ActionType.DISMISS:
      return {
        ...state,
        isOpen: false,
        asset: undefined
      }
    default:
      return state;
  }
}