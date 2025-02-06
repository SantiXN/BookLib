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
/**
 * 
 * @export
 * @interface EditAuthorRequest
 */
export interface EditAuthorRequest {
    /**
     * 
     * @type {string}
     * @memberof EditAuthorRequest
     */
    newFirstName?: string;
    /**
     * 
     * @type {string}
     * @memberof EditAuthorRequest
     */
    newLastName?: string;
    /**
     * 
     * @type {string}
     * @memberof EditAuthorRequest
     */
    newDescription?: string;
}

/**
 * Check if a given object implements the EditAuthorRequest interface.
 */
export function instanceOfEditAuthorRequest(value: object): value is EditAuthorRequest {
    return true;
}

export function EditAuthorRequestFromJSON(json: any): EditAuthorRequest {
    return EditAuthorRequestFromJSONTyped(json, false);
}

export function EditAuthorRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): EditAuthorRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'newFirstName': json['newFirstName'] == null ? undefined : json['newFirstName'],
        'newLastName': json['newLastName'] == null ? undefined : json['newLastName'],
        'newDescription': json['newDescription'] == null ? undefined : json['newDescription'],
    };
}

export function EditAuthorRequestToJSON(json: any): EditAuthorRequest {
    return EditAuthorRequestToJSONTyped(json, false);
}

export function EditAuthorRequestToJSONTyped(value?: EditAuthorRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'newFirstName': value['newFirstName'],
        'newLastName': value['newLastName'],
        'newDescription': value['newDescription'],
    };
}

