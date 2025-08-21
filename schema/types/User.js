module.exports = `
input signupInput {
    first_name:String!
    last_name:String!
    email:String!
    password:String!
    confirmPassword:String!
    role:String!
}
input loginInput {
    email:String!
    password:String!
}

input setPasswordInput{
    token:String!
    password:String!
    confirmPassword:String!
}

input changePasswordInput {
    oldPassword:String!
    password:String!
    confirmPassword:String!
}

input updateProfileInput {
    _id:String
    first_name:String!
    last_name:String!
    role:String!
    profile_pic:String
}

input userListInput {
    search:userSearchType
}

input userSearchType {
    status:String
}

type loginResponse {
    error:[error]
    message:String
    severity:String
    response:authFields
    token:String
}

type userListResponse {
    response:[userFields]
}

type userDetailsResponse {
    response:userFields
}

type userFields {
    _id:String
    id:Int
    first_name:String
    last_name:String
    email:String
    role:String
    profile_pic:String
    status:String
    action:action
}

type tokenToSetPasswordResponse {
    error:[error]
    token:String
    message:String
    severity:String
}

type Mutation {
    signup(input:signupInput):generalFormResponse
    changeStatus(input:idInput):generalResponse
    removeUser(input:idInput):generalResponse
    setPassword(input:setPasswordInput):generalFormResponse
    changePassword(input:changePasswordInput):generalFormResponse
    updateProfile(input:updateProfileInput):generalFormResponse
}
type Query {
    login(input:loginInput):loginResponse
    userList(input:userListInput):userListResponse
    userDetails(input:objIdInputOp):userDetailsResponse
    getTokenToSetPassword(input:emailInput):tokenToSetPasswordResponse
}
`;
