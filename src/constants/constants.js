//these varaibles can be modified, they provide additional info to app for performing http and other tasks

export const host = "localhost";
export const port = "3000";
const secureHttp = false;

//dont modify these:
export const httpProtocol = `http${secureHttp ? "s" : ""}`;
export const baseUrl = `${httpProtocol}://${host}:${port}`;

// export const baseUrl = "";
