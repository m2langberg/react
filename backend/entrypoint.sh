#!/bin/bash

# Prepare log files and start outputting logs to stdout
mkdir ./logs
chmod -R 755 ./logs
touch ./logs/gunicorn.log
touch ./logs/gunicorn-access.log
tail -n 0 -f ./logs/gunicorn*.log &

exec python manage.py migrate &

export DJANGO_SETTINGS_MODULE=qppacs.settings

exec gunicorn qppacs.wsgi:application \
    --name projectx_django \
    --bind 0.0.0.0:5000 \
    --workers 5 \
    --log-level=info \
    --log-file=./logs/gunicorn.log \
    --access-logfile=./logs/gunicorn-access.log \
"$@"

