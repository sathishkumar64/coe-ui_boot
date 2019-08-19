# coe-ui

1. Update env.list for environment variables. <br />
For host machine studentService and school Service use host as 'host.docker.internal'
As node uses diffrent library for http and https communication , update protocol accordingly.
Default port is 8080 , if changes please also use same port in docker run.

2. To run locally update utils/constants.js if needed (only update the value after || as that is default value in case environment variables are absent ) , go to root directry and run 'npm start' . <br />
Default port is 3000. http://localhost:3000/ 

3. To Build Docker Image , go in root directory and run below command. <br />
  docker build -t <user-name>/coe-ui:1.0.0 .

4. Docker Run <br />
  docker run -p <forwaded-port>:8080 -d --env-file ./env.list <user-name>/coe-ui

5. Docker logs <br />
   docker ps <br />
   fetch container id for <user-name>/coe-ui <br />
   
   docker logs <container-id> <br />

6. Home page <br />
   http://host:port/

7. Health Check <br />
   http://host:port/health-check
