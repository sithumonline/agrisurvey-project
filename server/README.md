```bash
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your specific settings

# Run migrations
python manage.py makemigrations api
python manage.py migrate

# Create a superuser for admin access
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```
