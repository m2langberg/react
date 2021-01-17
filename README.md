# React, Django Rest API, MySQL


This project consist of a docker-compose.yaml file that will startup the project

The subdirecories are:

    frontend: The React App
    backend: The Django Rest API App
    proxy: Proxies traffic to front/back -end
    editor: Visual Studio Code


Before you do a docker-compose build, you need to set the following environment variables:

    UID: Linux user id
    GID: Linux group id 
    GROUP: Linux group name
    USER: Linux user name
    DISPLAY: If you are using the editor container, set this to get it to display

After build you need to initialize the backend:

```bash
docker-compose up -d
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

And the frontend:

```bash
docker-compose run frontend yarn install
docker-compose up -d
```

You should now be up and running @ http://localhost:8080

The Django admin page is at http://localhost:8080/admin
Use the superuser account to add other users and projects

The Django Rest API is at http://localhost:8080/api/1.0/

The Django Rest API auth page is at http://localhost:8080/api/1.0/rest-auth/login/



