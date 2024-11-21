# BookManagementSystem
User account management service for Book management system.

REST APIs supported in the microservice:

1. User Registration                        - http://localhost:5000/api/auth/registerUser
2. User Login                               - http://localhost:5000/api/auth/userLogin
3. User Logout                              - http://localhost:5000/api/auth/userLogout

// user APIs
4. Change Password                          - http://localhost:5000/api/users/changePassword

// admin APIs to manage user profiles
// Needs Admin authentication
5. Add User                                 - http://localhost:5000/api/admin/addUser
6. View User based on username or email     - http://localhost:5000/api/admin/getUser
7. View User based on db id                 - http://localhost:5000/api/admin/getUser/:userId
8. View all Users                           - http://localhost:5000/api/admin/getAllUsers
9. Delete a user                            - http://localhost:5000/api/admin/deleteUser
10. Delete a user based on db id            - /admin/deleteUser/:userId
