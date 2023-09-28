const SUCCESS = "success.";
const ERROR = "error.";
const MONGO_SERVER_ERROR = "Internal Server Error!";
const PROGRAMMING_ERROR = "Internal Server Error!";
const SESSION_EXPIRE = "Session expire!";
const GOOGLE_EMAIL = 'User registered with google email!';
const EMAIL_ALREADY = 'User already registered with this email!';
const USERNAME_ALREADY = 'User already registered with this username!';
const MOBILE_ALREADY = 'User already registered with this mobile!';
const USER_NOT_EXIST = "User doesn't exists!";
const NOT_ENOGH_POINTS = "Not enough points!";
const SCHEME_NOT_EXIST = "Scheme doesn't exists!";
const INTERNAL_SERVER_ERROR = "Internal server error!";
const SCHEME_VALIDITY_ERROR = "Scheme validity expired!";
const SCHEME_ALREADY_APPLIED = "Scheme already applied!";
const INCORRECT_PASSWORD = "Password Mismatch!";
const PERMISSION_DENIED = "Permission denied!";
const INVALID_TOKEN = "Invalid token!";

const STATUS_CODES = {
    SUCCESS: 200,
    MONGO_SERVER_ERROR: 500,
    PROGRAMMING_ERROR: 500,
    SESSION_EXPIRE: 401,
    GOOGLE_EMAIL: 400,
    EMAIL_ALREADY: 400,
    USERNAME_ALREADY: 400,
    MOBILE_ALREADY: 400,
    USER_NOT_EXIST: 404,
    NOT_ENOGH_POINTS: 400,
    SCHEME_NOT_EXIST: 404,
    INTERNAL_SERVER_ERROR: 500,
    SCHEME_VALIDITY_ERROR: 400,
    SCHEME_ALREADY_APPLIED: 400,
    INCORRECT_PASSWORD: 400,
    PERMISSION_DENIED: 403,
};

module.exports = {
    SUCCESS,
    ERROR,
    MONGO_SERVER_ERROR,
    PROGRAMMING_ERROR,
    SESSION_EXPIRE,
    EMAIL_ALREADY,
    MOBILE_ALREADY,
    GOOGLE_EMAIL,
    USER_NOT_EXIST,
    NOT_ENOGH_POINTS,
    SCHEME_NOT_EXIST,
    INTERNAL_SERVER_ERROR,
    SCHEME_VALIDITY_ERROR,
    SCHEME_ALREADY_APPLIED,
    INCORRECT_PASSWORD,
    PERMISSION_DENIED,
    USERNAME_ALREADY,
    STATUS_CODES,
    INVALID_TOKEN
};