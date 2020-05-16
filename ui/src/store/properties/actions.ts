import axios from 'axios';
import { Dispatch } from 'redux';
import propertyRequester from '../../utils/axios';

interface PaginationPayload {
  page: number;
  size: number;
}

export const fetchProperties = (
  payload: PaginationPayload = { page: 0, size: 10 },
) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: 'PROPERTIES:GET/START' });
    try {
      const requester = await propertyRequester();
      const response = await requester.get('/properties', {
        params: payload,
      });

      if (response)
        dispatch({ type: 'PROPERTIES:GET/SUCCESS', payload: response.data });
    } catch (e) {
      dispatch({ type: 'PROPERTIES:GET/ERROR', payload: e });
    }
  };
};

export const updatePropertyInterest = (payload: {
  propertyId: number;
  interested: boolean;
}) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: 'PROPERTY:UPDATE/START' });

    try {
      const requester = await propertyRequester({ authRequired: true });
      const response = await requester.put(`/interest/${payload.propertyId}`, {
        isInterested: payload.interested,
      });
      if (response) dispatch({ type: 'PROPERTY:UPDATE/SUCCESS' });
    } catch (e) {
      dispatch({ type: 'PROPERTY:UPDATE/ERROR' });
    }
  };
};
