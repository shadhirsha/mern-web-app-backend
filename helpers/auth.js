import bcrypt from "bcrypt";

const saltRounds = 12;

export const hashPassowrd = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err){
                reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
                // Store hash in your password DB.
            });
        });
    });
};

export const comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}