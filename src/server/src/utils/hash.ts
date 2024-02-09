export function encodeBase64(data: any): string {
    if (data === null || data === undefined) {
        return null;
    }
    if (typeof data === "object") {
        data = JSON.stringify(data);
    } else {
        data = String(data);
    }
    return Buffer.from(data).toString("base64");
}

export function decodeBase64(base64: string): any {
    return Buffer.from(base64, "base64").toString("utf8");
}
