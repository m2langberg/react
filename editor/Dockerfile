FROM debian:9

ARG UID
ARG GID
ARG USER
ARG GROUP

RUN apt-get update
RUN apt-get install -y wget gpg

RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
RUN install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
RUN sh -c 'echo "deb [arch=amd64 signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/vscode stable main" > /etc/apt/sources.list.d/vscode.list'

WORKDIR /usr/lib/apt/methods
RUN ln -s http https


RUN apt-get update
RUN apt-get install -y apt-transport-https
RUN apt-get install -y libasound2 code

RUN groupadd -g $GID $GROUP
RUN useradd -ms /bin/bash -u $UID -g $GID $USER

RUN chown -R $UID:$GID /usr/src

VOLUME /usr/src/frontend/app
VOLUME /usr/src/frontend/app/node_modules
VOLUME /usr/src/backend/src

WORKDIR /usr/src/

CMD exec /bin/bash -c "trap : TERM INT; code; sleep infinity & wait"
