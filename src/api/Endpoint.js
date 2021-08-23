import {isIos} from '@helpers/UtilsHelpers';

export const baseUrl = isIos()
  ? 'http://localhost:3000'
  : 'http://10.0.2.2:3000';

export const CREATECHANNEL = '/api/v1/tours/';

export const gymMembershipListUrl = id => {
  return id
    ? '/api/v1/app/gym/membership?userId=' + id
    : '/api/v1/app/gym/membership';
};
