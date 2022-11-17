// * * * * * * * * * * * *  S E T U P  * * * * * * * * * * * * * * *

const spicedPg = require("spiced-pg");
const { USER, PASSWORD } = process.env;

const user = USER;
const password = PASSWORD;
const database = "petition";
// this establishes the connection to the db
// it get's a connection string as an argument
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${user}:${password}@localhost:5432/${database}`
);

// * * * * * * * * * * * *  G E T  D A T A  * * * * * * * * * * * * *

function getSignaturebyId(id) {
    return db.query("SELECT signature FROM signatures WHERE userid = $1", [id]);
    // .then((result) => result.rows[0]);
}

function getPasswordAndMoreByEmail(email) {
    return db.query("SELECT * FROM users WHERE email = $1", [email]);
    // .then((result) => result.rows[0]);
}

function getSigners() {
    return db.query(
        `SELECT users.firstname, users.lastname, user_profiles.city,  user_profiles.url, user_profiles.age
        FROM users
        JOIN user_profiles
        ON users.id = user_profiles.user_id`
    );
    //.then((result) => console.log(result.rows));
}

function getSignersWithMoreInfo(id) {
    return db.query(
        `SELECT users.firstname, users.lastname, users.email, user_profiles.city,  user_profiles.url, user_profiles.age
        FROM users
        JOIN user_profiles
        ON users.id = user_profiles.user_id
        WHERE users.id = $1`,
        [id]
    );
    //.then((result) => console.log(result.rows));
}

function getSignersByCity(city) {
    return db.query(
        `SELECT users.firstname, users.lastname, user_profiles.city,  user_profiles.url, user_profiles.age
        FROM users
        JOIN user_profiles
        ON users.id = user_profiles.user_id
        WHERE user_profiles.city = $1`,
        [city]
    );
    //.then((result) => console.log(result.rows));
}

// * * * * * * * * * * * *  U P D A T E   T A B L E S  * * * * * * * * *

//  E D I T  USERS W I T H  PW
function editUsersWithPassword({ firstname, lastname, email, password, id }) {
    return db.query(
        `UPDATE users
                    SET firstname=$1, lastname=$2, email=$3, password=$4
                    WHERE id=$5`,
        [firstname, lastname, email, password, id]
    );
}

//  E D I T  USERS W I T H O U T  PW
function editUsersWithoutPassword({ firstname, lastname, email, id }) {
    return db.query(
        `UPDATE users
                    SET firstname=$1, lastname=$2, email=$3
                    WHERE id=$4`,
        [firstname, lastname, email, id]
    );
}

//  E D I T  USER_PROFILES
function editProfiles({ age, city, url, user_id }) {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET age=$1, city=$2, url=$3
        `,
        [age, city, url, user_id]
    );
}

//D E L E T E  S I G N A T U R E
function deleteSignature(id) {
    return db.query(
        `
            DELETE FROM signatures
            WHERE userid=$1
        `,
        [id]
    );
}

//D E L E T E  P R O F I L E
function deleteProfile(userId) {
    return db.query(
        `
            DELETE FROM users
            WHERE id=$1
        `,
        [userId]
    );
}

// * * * * * * * * * * * *  I N S E R T  T A B L E S  * * * * * * * * *

// t a b l e  s i g n a t u r e s
function insertSignature({ signature, id }) {
    return db
        .query(
            `INSERT INTO signatures (
                signature, userid)
    VALUES ($1, $2)
    RETURNING *`,
            [signature, id]
        )
        .then((result) => result.rows[0]);
}

// t a b l e  u s e r s
function updateUsers({ firstname, lastname, email, password }) {
    console.log(firstname, lastname, email, password);
    return db
        .query(
            `INSERT INTO users (
                firstname, lastname, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
            [firstname, lastname, email, password]
        )
        .then((result) => result.rows[0]);
}

//t a b l e  p r o f i l e s
function updateProfiles({ age, city, url, user_id }) {
    return db
        .query(
            `INSERT INTO user_profiles (
                age, city, url, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
            [age, city, url, user_id]
        )
        .then((result) => result.rows[0]);
}

//* * * * * * * * * * * * * * * E X P O R T  * * * * * * * * * * * * *

module.exports = {
    editUsersWithPassword,
    editUsersWithoutPassword,
    editProfiles,
    deleteSignature,
    deleteProfile,

    insertSignature,
    updateProfiles,
    updateUsers,

    getSigners,
    getSignersWithMoreInfo,
    getSignersByCity,
    getSignaturebyId,

    getPasswordAndMoreByEmail,
};
