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
 * @interface UserInfo
 */
export interface UserInfo {
    /**
     * 
     * @type {number}
     * @memberof UserInfo
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof UserInfo
     */
    role?: UserInfoRoleEnum;
    /**
     * 
     * @type {string}
     * @memberof UserInfo
     */
    firstName: string;
    /**
     * 
     * @type {string}
     * @memberof UserInfo
     */
    lastName?: string;
    /**
     * 
     * @type {string}
     * @memberof UserInfo
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof UserInfo
     */
    avatarPath?: string;
}


/**
 * @export
 */
export const UserInfoRoleEnum = {
    User: 'user',
    Admin: 'admin',
    Editor: 'editor'
} as const;
export type UserInfoRoleEnum = typeof UserInfoRoleEnum[keyof typeof UserInfoRoleEnum];


/**
 * Check if a given object implements the UserInfo interface.
 */
export function instanceOfUserInfo(value: object): value is UserInfo {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('firstName' in value) || value['firstName'] === undefined) return false;
    if (!('email' in value) || value['email'] === undefined) return false;
    return true;
}

export function UserInfoFromJSON(json: any): UserInfo {
    return UserInfoFromJSONTyped(json, false);
}

export function UserInfoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserInfo {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'role': json['role'] == null ? undefined : json['role'],
        'firstName': json['firstName'],
        'lastName': json['lastName'] == null ? undefined : json['lastName'],
        'email': json['email'],
        'avatarPath': json['avatarPath'] == null ? undefined : json['avatarPath'],
    };
}

export function UserInfoToJSON(json: any): UserInfo {
    return UserInfoToJSONTyped(json, false);
}

export function UserInfoToJSONTyped(value?: UserInfo | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'role': value['role'],
        'firstName': value['firstName'],
        'lastName': value['lastName'],
        'email': value['email'],
        'avatarPath': value['avatarPath'],
    };
}

