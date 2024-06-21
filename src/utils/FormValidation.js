import { ApiError } from "./ApiError.js";



function validateFormFields(fields) {
    if (fields.some((value) => !value)) {
        throw new ApiError(400, "Form value field can't be empty");
    }
}


function validateEmailFormat(email) {
    const invalidEmail = !email.includes("@");
    invalidEmail ? (() => { throw new ApiError(400, "Invalid Email format"); })() : null;
}


function validatePasswordFormat(password) {
    // Regular expressions to check the conditions
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    // Check if all conditions are met
    if (!hasCapitalLetter) {
        throw new ApiError(400, "Password must contain at least one capital letter");
    }
    if (!hasSpecialChar) {
        throw new ApiError(400, "Password must contain at least one special character");
    }
    if (!hasNumber) {
        throw new ApiError(400, "Password must contain at least one number");
    }
}


export {validateEmailFormat,validateFormFields,validatePasswordFormat}