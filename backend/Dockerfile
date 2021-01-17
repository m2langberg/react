FROM python:3.7

ARG UID
ARG GID
ARG USER
ARG GROUP
ARG TZ=America/Los_Angeles

# File Author / Maintainer
MAINTAINER Mike Langberg <Mike.Langberg@wdc.com>


# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV TZ=$TZ

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


WORKDIR /opt
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

RUN groupadd -g $GID $GROUP
RUN useradd -ms /bin/bash -u $UID -g $GID $USER
 
COPY src /opt/code
RUN chown $UID:$GID -R /opt/code
COPY ./entrypoint.sh /.
RUN chmod 777 /entrypoint.sh
USER $USER
WORKDIR /opt/code

# Collect our static media.
RUN python manage.py collectstatic --noinput

ENTRYPOINT ["/entrypoint.sh"]



