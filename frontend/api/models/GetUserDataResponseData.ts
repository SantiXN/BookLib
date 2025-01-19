/* tslint:disable */
/* eslint-disable */
/**
 * Book Lib public API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { UserData } from './UserData';
import {
    UserDataFromJSON,
    UserDataFromJSONTyped,
    UserDataToJSON,
    UserDataToJSONTyped,
} from './UserData';

/**
 * 
 * @export
 * @interface GetUserDataResponseData
 */
export interface GetUserDataResponseData {
    /**
     * 
     * @type {UserData}
     * @memberof GetUserDataResponseData
     */
    data: UserData;
}

/**
 * Check if a given object implements the GetUserDataResponseData interface.
 */
export function instanceOfGetUserDataResponseData(value: object): value is GetUserDataResponseData {
    if (!('data' in value) || value['data'] === undefined) return false;
    return true;
}

export function GetUserDataResponseDataFromJSON(json: any): GetUserDataResponseData {
    return GetUserDataResponseDataFromJSONTyped(json, false);
}

export function GetUserDataResponseDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetUserDataResponseData {
    if (json == null) {
        return json;
    }
    return {
        
        'data': UserDataFromJSON(json['data']),
    };
}

export function GetUserDataResponseDataToJSON(json: any): GetUserDataResponseData {
    return GetUserDataResponseDataToJSONTyped(json, false);
}

export function GetUserDataResponseDataToJSONTyped(value?: GetUserDataResponseData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'data': UserDataToJSON(value['data']),
    };
}

