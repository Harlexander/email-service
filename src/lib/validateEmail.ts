import validate from "deep-email-validator"

export const validateEmail = async (email: string) => {
    const status = await validate({
        email : email, 
        validateRegex : true,
        validateMx : true,
        validateDisposable : true, 
        validateSMTP : false,
        validateTypo : false
    });

    return status;
}