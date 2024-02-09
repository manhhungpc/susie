import { StatusCodes } from "./status-codes";
import moment from "moment-timezone";
// import {appConfig} from "@base/config/app";
import { apiConfig, serverConfig } from "@config/app";
import mongoose, { Schema, Types } from "mongoose";
import slugify from "slugify";

export function success(data: any, headers: any = null) {
    return base_response(true, StatusCodes.OK, data, null, headers);
}

export function error(message: String, headers: any = null) {
    return base_response(false, StatusCodes.BAD_REQUEST, null, message, headers);
}

export function fail(code: Number, message: String, headers: any = null) {
    return base_response(false, code, null, message, headers);
}
function base_response(success: boolean, code: Number, data: any = null, message: String = null, headers: any = null) {
    data = transform_data(data);
    return {
        success: success,
        status: code,
        message: message,
        data: data,
    };
}

function transform_data(data: any) {
    const dateColumns = ["created_at", "updated_at", "deleted_at", "deadline"];
    const allowedTypes = ["boolean", "number", "string", "bigint", "symbol", "undefined"];
    try {
        if (!data || allowedTypes.includes(typeof data)) {
            return data;
        }

        if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                data[i] = transform_data(data[i]);
            }
        } else if (typeof data === "object") {
            if (data instanceof Types.ObjectId) {
                return { id: data.toJSON() };
            }

            for (const property in data) {
                // if (property === "_id" && mongoose.Types.ObjectId.isValid(data["_id"])) {
                //     data["id"] = data["_id"].toString();
                //     delete data["_id"];
                // } else
                if (dateColumns.includes(property)) {
                    if (data[property]) data[property] = formatTimezone(data[property]);
                } else {
                    data[property] = transform_data(data[property]);
                }
            }
        }

        return data;
    } catch (e) {
        console.log(e);
    }
}

export function paginate(data: any, total: number, per_page: number, current_page: number) {
    data = transform_data(data);
    let from = (current_page - 1) * per_page + 1;
    let to = current_page * per_page <= total ? current_page * per_page : total;
    if (from > to) from = to = 0;
    return {
        data: data,
        pagination: {
            total: total,
            per_page: per_page,
            current_page: current_page,
            last_page: Math.ceil(total / per_page),
            from: from,
            to: to,
        },
    };
}

function columnDatetime() {
    return ["created_at", "updated_at", "deleted_at", "deadline"];
}

export function formatTimezone(date: any, local: boolean = false) {
    if (local) return moment(date).format(serverConfig.formatDatetime);
    return moment(date).tz(serverConfig.timezone).format(serverConfig.formatDatetime);
}

export function format_page(page: any) {
    return Number(page) < 1 || Number.isNaN(page) ? 1 : Number(page);
}

export function format_per_page(per_page: any) {
    if (isNaN(per_page) || Number(per_page) < 1 || Number(per_page) > 100) return Number(apiConfig.perPage);
    return Number(per_page);
}

export function paginateArray(array: any[], page_size: number, page_number: number) {
    const total = array.length;
    const currentPage = page_number > 0 ? page_number - 1 : page_number;

    const data = array.slice(currentPage * page_size, currentPage * page_size + page_size);
    let from = (currentPage - 1) * page_size + 1;
    let to = currentPage * page_size <= total ? currentPage * page_size : total;
    if (from > to) from = to = 0;

    return {
        data: data,
        pagination: {
            total: total,
            per_page: page_size,
            current_page: page_number,
            last_page: Math.ceil(total / page_size),
            from: from,
            to: to,
        },
    };
}

// export function validateEmail(email: string) {
//     const regex = /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i
//     return regex.test(email)
// }

// export function validatePhone(phone: string) {
//     const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
//     return regex.test(phone)
// }

export function getFormattedDate(date: any) {
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return day + month + year;
}

export function slugString(data: string): string {
    const slug = slugify(data, {
        replacement: "_",
        lower: true,
    });

    return slug;
}
