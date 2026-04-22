export const isPasswordMinLength = (password) => password.length >= 8;
export const doPasswordsMatch = (password, confirm) => password === confirm;
