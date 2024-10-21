![ci workflow](https://github.com/agustinruatta/fytech/actions/workflows/ci.yml/badge.svg)

## Description

Software for tracking portfolios consisting of different investments.

This is the backend part of the project.

## SetUp and run the project
- Install docker on your machine
- Copy the `.env.example` file to `.env` and set the environment variables. Check the comments inside the file for more information.
- Execute `npm run up`
  - If you have any error related to permissions, check that all the files and folders inside "docker" have the right permissions.

## Test
There are two kinds of tests: 
- Unit tests (located under test/unit): this does not require the application to be running.
- Integration tests (located under test/e2e): this requires docker to be running because it uses a test database.

To run the tests, you can use the following commands:
- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:e2e`
- Unit and integration tests: `npm run test`

## Support

Email me to [agustinruatta@gmail.com](mailto:agustinruatta@gmail.com)

## Stay in touch

- Agustin Ruatta - [agustinruatta@gmail.com](mailto:agustinruatta@gmail.com) - [LinkedIn](https://www.linkedin.com/in/agustinruatta/)
