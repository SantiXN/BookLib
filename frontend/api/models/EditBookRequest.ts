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
 * @interface EditBookRequest
 */
export interface EditBookRequest {
    /**
     * 
     * @type {string}
     * @memberof EditBookRequest
     */
    newTitle?: string;
    /**
     * 
     * @type {string}
     * @memberof EditBookRequest
     */
    newDescription?: string;
    /**
     *
     * @type {string}
     * @memberof EditBookRequest
     */
    newCoverPath?: string;
}

/**
 * Check if a given object implements the EditBookRequest interface.
 */
export function instanceOfEditBookRequest(value: object): value is EditBookRequest {
    return true;
}

export function EditBookRequestFromJSON(json: any): EditBookRequest {
    return EditBookRequestFromJSONTyped(json, false);
}

export function EditBookRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): EditBookRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'newTitle': json['newTitle'] == null ? undefined : json['newTitle'],
        'newDescription': json['newDescription'] == null ? undefined : json['newDescription'],
        'newCoverPath': json['newCoverPath'] == null ? undefined : json['newCoverPath'],
    };
}

export function EditBookRequestToJSON(json: any): EditBookRequest {
    return EditBookRequestToJSONTyped(json, false);
}

export function EditBookRequestToJSONTyped(value?: EditBookRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'newTitle': value['newTitle'],
        'newDescription': value['newDescription'],
        'newCoverPath': value['newCoverPath'],
    };
}

