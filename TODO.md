- create filters for request's params. Id and filter
- create Response function with default field success and message for consistence for Error handling.
- move all error messages to the config
- make sort imports work
- update ZodValidationPipe to be less complex
- make randomString function work async to not block the queue
- add types to express for token
- add operation to remove not used tokens from DB
- add logger Pino
- photo: check begging to insure that type if correct: file-type-mime


Використав 2 години з 12:11 до 14:23
+ 2 (yesterday) + 2 + 1 today until 19:12

12 hours +
27.11.2023 + 2 hours
28.11.2023 + 2 hours + 1 hour
29.11.2023 + 3 hours


Plan:
1.  [+] Create migrations for creating tables +
2.  [+] Test connecting to Database +
3.  [+] Connect all http services to DB +
4.  [+] Handle error from services +
5.  [+] Upload photo and save link to database +
6.  [+] Write logic for Token +
13. [+]  Make a request to get photo from database +
9.  [+] generate 45 users with seeder using sort of real data +
7.  [+] Write logic for reading user's pages +
15. [+] Check if page or offset exist in the user's request +
12. [+] create Frontend just to show my result +
16. [+] Create two pipes for first validate a photo and second optimized, compressed a photo +
8.  [+] Add dimension check to the photo +
14. [+] Add validation to the photo +
10. [+] crop image to center at 70*70 ration as jpg +
11. [+] optimize image using tinypng.com or other 3-d part library (sharp is faster and get more functionality, and don't limit requests by month) +
17. Check memory leaks in application
18. Add clustering for production images
19. Update app to run in the web without Nginx configuration
20. Update app for scaling and productivity
16. Add Unit tests
