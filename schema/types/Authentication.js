module.exports = `
type authResponse{
    status:Boolean
    response:authFields
}
 
type Query {
    auth:authResponse
}
`;
