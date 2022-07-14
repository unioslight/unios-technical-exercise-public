# Unios Technical Exercise

This project represents progress toward a very basic Lesson Scheduling system. Using this application, an end-user should be able to create classes by selecting a teacher, a room, and an available time-slot (session).

## Before starting

This application has been developed using [Next.js](https://nextjs.org/), some basic [React](https://reactjs.org/), [Prisma](https://www.prisma.io/), and a [PostgreSQL](https://www.postgresql.org/) database. You may not be familiar with all or any of these technologies, and that is okay! Discovery and investigation are intrinsic parts of the exercise. We feel that this project is at a level that can be reasonably well understood with some help from the corresponding library documentation.

As a result of this, the suggested times are indicative of time required to complete the task, and should not include any time spent reading documentaiton.

Please ensure your development environment has the following tools available in your `$PATH`:

-   [ ] Node (at least v14.18.0)
-   [ ] Docker

## Setup

1. [Fork](https://github.com/unioslight/unios-technical-exercise/fork) the repository to your personal GitHub account
1. Clone the repository to your local development workspace
1. Install project dependencies:
    ```bash
    yarn install
    ```
1. Create a container to run a development PostgreSQL instance (Note that the following will expose the database through port `5439`):

    ```bash
    docker pull postgres

    docker run --name unios-exercise-db -e POSTGRES_PASSWORD=password -d -p 5439:5432 postgres
    ```

1. Create the development database for the web application:
    ```bash
    yarn prisma migrate reset
    ```
1. Update locally generated prisma types:
    ```bash
    yarn prisma generate
    ```
1. You can now run the local development server:
    ```bash
    yarn next
    ```

## Exercises

### Task 1

#### Suggested time: 10 minutes

The form in `src/components/BookingForm.tsx` should allow users to specify a name and select a teacher, room, and time slot for a proposed lesson. Currently, the form does not provide a way for a user to select a teacher or a room.

Please update the form to add this missing capability. React hooks best practices should be followed as much as possible.

The required endpoints are already available at `localhost:3000/api/rooms` and `localhost:3000/api/teachers`

### Task 2

#### Suggested time: 1 hour

With all required fields present, hitting the submit button still throws an HTTP 500 error because the corresponding API endpoint has not yet been implemented.

Please implement the `api/lessons` REST endpoint(s) so that the following functional requirements are met:

-   [ ] A lesson must specify a Name, Teacher, Room and Session in order to be created
-   [ ] The system must prevent teachers from being double-booked for the same session
-   [ ] The system must prevent rooms from being double-booked for the same session
-   [ ] A lesson is saved/persisted in the system if each of the above requirements is met

Some things to make note of:

-   All database queries are being handled by a Prisma.
-   A model has been created for Lesson in `schema.prisma`, but feel free to adjust this as you see fit.
-   Next.js API endpoints exist within `/pages/api/`. The lessons endpoint file has already been created. More information on Next.js APIs are available in their documentation linked below.
-   Some basic API handlers have already been created for rooms, sessions and teachers, but feel free to adjust these as you see fit.
-   Create the solution in a way appropriate for a production environment, with appropriate error handling and responses.
-   Leave TODOs/comments for any tasks or improvements you would make given more time.

### Task 3

#### Suggested time: 30 minutes

A seperate system requires an understanding of how busy each teacher is, and what remuneration category they may fall into.

It is recommended to complete task 2 before beginning this task.

Using Prisma's raw SQL queries (as opposed to the Prisma Client CRUD API), create an GET REST API response that fulfils the following brief by the school's principal:

-   [ ] Shows each teacher's name
-   [ ] Shows each teacher's sum total lessons
-   [ ] Shows each teacher's favourite/most used room.
-   [ ] Indicates or categorises in some way teachers that are full-time and casual. A teacher with more than 10 total lessons is considered full-time.

Some things to make note of:

-   This endpoint does not need a page or interface created. It just needs a working GET endpoint for now
-   Some Prisma SQL code has been prepared in `/pages/api/teachers/summary.ts`
-   There may be different ways to solve/present the 4th requirement. The solution design is up to you.
-   More information on Prisma raw SQL queries available in documentation linked below

## Submitting your solution

To submit your solution for review, please create a pull request from your fork to the upstream branch. Please leave as much of your git history in-tact (i.e. please do not squash your commits).

## Resources

-   [Next.js documentation](https://nextjs.org/docs/getting-started)
-   [Prisma documentation](https://www.prisma.io/docs/concepts/components/prisma-client)
-   [Prisma raw database access](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access)
-   Feel free to use Google and StackOverflow to your heart's content!

## For Interviewees

If you are undertaking this exercise as part of a an interview, you may have been provided with a different set of exercises from those listed above. Additionally, please take some time to look over the codebase as a whole aside from the exercise tasks. We will be interested in hearing your opinions and ideas surrounding this codebase including:

-   aspects of the codebase that you like or dislike, and the reasons why
-   any facets of the solution architecture that you would change or that you feel could be improved
-   any commentary on style, tech-stack, libraries used, etc.
-   any changes that you would personally make to the application as a whole

## Contact

We welcome any comments, suggestions or feedback from participants. Feel free to drop us a line at `devops@unios.com`.
