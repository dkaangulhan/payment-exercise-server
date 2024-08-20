# Excersie project for implementing iyzico payment systems.

## Initialize

- You need npm installed in your computer. Before you start running the server, you should fetch dependencies. In root of the repo, open terminal and type `npm install`.
- The app uses environment variables. Following list should be provided in .env file in root of the repo.
  - HOST: This field is used as the address of the running server. While developing, local ip address can be used. Note that android devices won't recognize "localhost". Use your attached ip address, for example: http://192.168.1.24:3000
  - IYZIPAY_URI: While developing use "https://sandbox-api.iyzipay.com" as URI.
  - IYZIPAY_API_KEY: API key attached to your account. Iyzico provides sandbox account. Details can be found here: [Docs](https://docs.iyzico.com/)
  - IYZIPAY_SECRET_KEY: Secret key attached to your account by iyzico.
  - MONGO_URI: Mongodb is used as database. Use your mongodb uri.
  - JWT_SECRET: JWT secret key.
  - JWT_EXPIRY: Duration of JWT tokens.

## Notes

- Passwords are not saved encrypted. If it is required to implement in a real world example, passwords should never be stored explicitly.
