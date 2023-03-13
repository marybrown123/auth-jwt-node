"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponse = void 0;
class UserResponse {
    constructor(user, token) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.token = token;
    }
}
exports.UserResponse = UserResponse;
