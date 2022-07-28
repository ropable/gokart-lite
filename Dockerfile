FROM python:3.9.12-slim-bullseye
MAINTAINER asi@dbca.wa.gov.au
LABEL org.opencontainers.image.source https://github.com/dbca-wa/gokart-lite

RUN apt-get update -y \
  && apt-get upgrade -y \
  && apt-get install --no-install-recommends -y gcc build-essential python3-dev \
  && rm -rf /var/lib/apt/lists/* \
  && pip install --upgrade pip

WORKDIR /usr/src/app

COPY requirements.txt ./
COPY gokart ./gokart
COPY dist/release ./dist/release
COPY uwsgi.ini  ./uwsgi.ini

RUN pip install --no-cache-dir -r requirements.txt

# Run the application as the www-data user.
USER www-data
EXPOSE 8080
CMD ["uwsgi", "-i", "uwsgi.ini"]
