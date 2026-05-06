export const isPasswordMinLength = (password) => { return password.length >= 8; };
export const doPasswordsMatch = (password, confirm) => { return password === confirm; };
