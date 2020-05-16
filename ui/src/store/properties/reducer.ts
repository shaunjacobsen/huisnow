import { pick } from 'lodash';

const initialData: any[] = [];

const initialState = {
  loading: false,
  loaded: false,
  error: undefined,
  total: 0,
  page: 0,
  data: initialData,
};

function flattenUserInterestObject(record) {
  const newRecord = { ...record, interest: record.UserInterests[0] };
  delete newRecord.UserInterests;
  return newRecord;
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'PROPERTIES:GET/START':
      return {
        ...state,
        loading: true,
        error: undefined,
      };
    case 'PROPERTIES:GET/SUCCESS':
      return {
        ...state,
        loading: false,
        loaded: true,
        error: undefined,
        total: action.payload.total,
        page: action.payload.page,
        data: action.payload.data.map(flattenUserInterestObject),
      };
    case 'PROPERTIES:GET/ERROR':
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.payload,
      };
    case 'PROPERTY:UPDATE/SUCCESS':
      // find the record in state data that has the action.payload.propertyId
      // swap its interest record or add it in
      const propertyToUpdate = state.data.find(
        d => d.id === action.payload.propertyId,
      );
      if (!propertyToUpdate) return { ...state };
      propertyToUpdate.interest = action.payload;

      return {
        ...state,
        data: [...state.data],
      };
    default:
      return state;
  }
};
