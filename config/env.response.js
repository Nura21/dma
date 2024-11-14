module.exports = {
  Success: {
    GetReport: {
      code: "200_001",
      message: "Success Get Report",
    },
    GetProduct: {
      code: "200_001",
      message: "Success Get Product",
    },
    InsertProduct: {
      code: "200_002",
      message: "Success Insert Product",
    },
    DeleteProduct: {
      code: "204_003",
      message: "Success Delete Product",
    },
    UpdateProduct: {
      code: "204_004",
      message: "Success Update Product",
    },
    GetTransaction: {
      code: "200_001",
      message: "Success Get Transaction",
    },
    InsertTransaction: {
      code: "200_002",
      message: "Success Insert Transaction",
    },
    DeleteTransaction: {
      code: "204_003",
      message: "Success Delete Transaction",
    },
    RegisterUser: {
      code: "200",
      message: "User registered successfully",
    },
    validCredentials: {
      code: "200",
      message: "Login successfully",
    },
    authenticated: {
      code: "200",
      message: "Authenticated",
    },
    logoutUser: {
      code: "200",
      message: "Logout successfully",
    },
    getUserProfile: {
      code: "200",
      message: "Get user profile successfully",
    },
  },
  Fail: {
    ErFail: {
      code: "400",
      message: "Error : ",
    },
    emailExist: {
      code: "400",
      message: "Email already exists",
    },
    emailNotExist: {
      code: "400",
      message: "Email not exists",
    },
    validationError: {
      code: "400",
      message: "Validation error",
      error: "Error : ",
    },
    invalidCredentials: {
      code: "401",
      message: "Username or password wrong",
    },
    unauthenticated: {
      code: "401",
      message: "Unauthenticated",
    },
    forbidden: {
      code: "403",
      message: "Forbidden",
    },
    notContent: {
      code: "204",
      message: "Not Content",
    },
    dataNotFound: {
      code: "404",
      message: "Data Not Found",
    },
  },
};
