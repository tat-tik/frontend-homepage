Чтобы развернуть сервер на Frontend сначала разверните сервер на Backend (инструкция в фале README.md в корне проекта Backend).  
Далее:

1. Убедитесь, что вы в папке проекта  
   **cd /home/tatik/diplom-backend**

2. Добавьте репозиторий с актуальной версией Node.js 22  
   **curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -**

3. Установите новую версию  
   **sudo apt install -y nodejs**

4. Клонируйте репозиторий  
   **git clone https://github.com/tat-tik/frontend-homepage.git**

5. Убедитесь, что вы в папке проекта  
   **cd frontend-homepage**

6. Установите зависимости  
   **npm install**

7. Создайте .env файл  
   **nano .env**  
   добавьте строку с URL  бэкенда: **VITE_API_URL=http://130.49.149.98**

8. Сделайте сборку  
   **npm run build**

9. Разрешение для  Vite dev сервер, добавляем в настройки  backstore/settings.py:
CORS_ALLOWED_ORIGINS = [

    "http://130.49.149.98:5173", 
    "http://130.49.149.98:8000",   
]

10.  В файле настроек проекта Nginx, который Вы создавали на этапе разворачивания бэкэнда **sudo nano /etc/nginx/sites-available/backstore** добавляем:  
    location / {  
        root /home/tatik/diplom-backend/frontend-homepage/dist;  
        index index.html index.htm;  
        try_files $uri $uri/ /index.html;  
        }

11. Перезапускаем веб-сервер Nginx: **sudo systemctl reload nginx**

12. Переходим на http://130.49.149.98/ и проверяем работу.