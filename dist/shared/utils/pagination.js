"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOffset = calculateOffset;
exports.validatePagination = validatePagination;
function calculateOffset(page, limit) {
    return (page - 1) * limit;
}
function validatePagination(page, limit) {
    return page > 0 && limit > 0 && limit <= 100;
}
