import bcrypt from "bcrypt"

export async function hashPassword (password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}

export async function checkPassword (password: string, encryptedPassword: string) {
    const verify = await bcrypt.compare(password, encryptedPassword)
    if(verify) {
        return true
    }else {
        return false
    }
}