module.exports = `
input idInput{
    id:Int!
}
input objIdInput{
    _id:String!
}
input objIdInputOp{
    _id:String
}
input emailInput {
    email:String!
}
type action {
    view:Boolean
    edit:Boolean
    changeStatus:Boolean
    remove:Boolean
}
type error {
    key:String
    value:String
}
type generalFormResponse {
    error:[error]
    message:String
    severity:String
}
type generalResponse {
    hasError:Boolean 
    message:String
    severity:String
}

type authFields {
    name:String
    role:String
    status:String
}
`;
