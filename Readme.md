## Run Project
- Install Packages
```console
  pip install -r scrapping_project/requirements.txt
  cd scrapping_project/ui
  npm i
```
- Add .env file to scrapping_project/ui folder with below
```
  VITE_BASE_URL=http://localhost:8000
```
- Build react ui
```console
  npm run build
```
- Run Dajngo Database makemigration
```console
  cd ..
  python manage.py makemigrations
  python manage.py migrate
```
- Now run the server
```console
  python manage.py runserver localhost:8000
```

### Note :-  VITE_BASE_URL in env file and django runserver url should be same  
