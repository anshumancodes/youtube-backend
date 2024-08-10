## Youtube - backend clone

with this project i will try to replicate youtube's backend features 

### tech

[core]
- nodejs
- express
- Mongodb


### run it locally 


``` bash 

git clone https://github.com/anshumancodes/youtube-backend

cd youtube-backend

npm i

npm run server


```

#### blog

read my blog on this project : https://anshumancdx.xyz/blog/Building_youtube_api_project


#### test api

Api live at  ; https://youtube-backend-1ybt.onrender.com [50-second-delay]



## API Reference

#### Get all items

```http
  Route:
  /api/v0/user


  ## Endpoints

| **Endpoint**            | **Method** | **Use**                                                           | **Requires Authentication** | **File Uploads**    |
|-------------------------|------------|-------------------------------------------------------------------|-----------------------------|---------------------|
| `/register`             | POST       | Registers a new user. Handles file uploads for `avatar` and `coverImage`. | No                          | `avatar`, `coverImage` |
| `/login`                | POST       | Logs in a user.                                                   | No                          | None                |
| `/logout`               | POST       | Logs out the currently authenticated user.                        | Yes                         | None                |
| `/refreshtoken`         | POST       | Reassigns a new access token.                                     | No                          | None                |
| `/change-password`      | POST       | Allows the authenticated user to change their password.            | Yes                         | None                |
| `/get-user`             | GET        | Retrieves the currently authenticated user's information.         | Yes                         | None                |
| `/update-avatar`        | PATCH      | Updates the user's avatar image.                                  | Yes                         | `avatar` (single file)|
| `/update-coverimage`    | PATCH      | Updates the user's cover image.                                   | Yes                         | `coverImage` (single file) |
| `/channel/:username`    | GET        | Retrieves the channel information of the specified user.          | Yes                         | None                |
| `/get-watch-history`    | GET        | Retrieves the watch history of the authenticated user.            | Yes                         | None                |


Route:
/api/v0/video

## Video Endpoints

| **Endpoint**           | **Method** | **Use**                                                   | **Requires Authentication** | **File Uploads**          |
|------------------------|------------|-----------------------------------------------------------|-----------------------------|---------------------------|
| `/upload`              | POST       | Uploads a video and its thumbnail to the channel.        | Yes                         | `thumbnail`, `videoFile`  |
| `/play/:videoId`       | GET        | Retrieves and plays the video by its ID.                 | No                          | None                      |
| `/update/:videoId`     | PUT        | Updates details of a video by its ID. Can only be done by the owner. | Yes                         | `thumbnail` (single file) |
| `/delete/:videoId`     | DELETE     | Deletes a video by its ID.                               | Yes                         | None                      |


  
```


[**More routes and endpoints will be available soon. Stay tuned for updates!**]

[hit me on mail](mailto:anshumanprof01@gmail.com)

[hit me on twitter](https://x.com/anshumancdx)
