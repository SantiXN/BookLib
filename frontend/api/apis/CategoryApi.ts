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


import * as runtime from '../runtime';
import type {
  ListCategoriesResponseData,
  UnauthorizedResponseData,
} from '../models/index';
import {
    ListCategoriesResponseDataFromJSON,
    ListCategoriesResponseDataToJSON,
    UnauthorizedResponseDataFromJSON,
    UnauthorizedResponseDataToJSON,
} from '../models/index';

/**
 * 
 */
export class CategoryApi extends runtime.BaseAPI {

    /**
     */
    async listCategoriesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListCategoriesResponseData>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearerAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/category/list`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListCategoriesResponseDataFromJSON(jsonValue));
    }

    /**
     */
    async listCategories(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListCategoriesResponseData> {
        const response = await this.listCategoriesRaw(initOverrides);
        return await response.value();
    }

}
