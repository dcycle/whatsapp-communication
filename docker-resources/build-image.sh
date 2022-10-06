#!/bin/sh
#
# Build the Docker images.
#
set -e

npm install \
  express \
  mongoose \
  body-parser \
  passport \
  passport-local-mongoose \
  socket.io \
  express-session \
  js-yaml \
  nodemailer \
  passport-github2 \
  deepmerge
