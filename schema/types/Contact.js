module.exports = `
input contactInput {
    name: String!
    email: String!
    mobile: String!
    subject: String!
    message: String!
}

type contactFields {
    _id:String
    id:Int
    name: String!
    email: String!
    mobile: String!
    subject: String!
    message: String!
    createdAt: String!
}   
type contactListResponse {
    response:[contactFields]
}
type Mutation {
    createContact(input:contactInput):generalResponse
}
type Query {
    contactList:contactListResponse
}
`;
