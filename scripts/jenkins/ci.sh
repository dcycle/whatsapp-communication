#!/bin/bash
#
# Test on Jenkins.
#
set -e
source ~/.docker-host-ssh-credentials

# Create a droplet
DROPLET_NAME=docker-whatsapp-communication
IP1=$(ssh "$DOCKERHOSTUSER@$DOCKERHOST" \
  "./digitalocean/scripts/new-droplet.sh "$DROPLET_NAME)
# https://github.com/dcycle/docker-digitalocean-php#public-vs-private-ip-addresses
IP2=$(ssh "$DOCKERHOSTUSER@$DOCKERHOST" "./digitalocean/scripts/list-droplets.sh" |grep "$IP1" --after-context=10|tail -1|cut -b 44-)
echo "Now determining which of the IPs $IP1 or $IP2 is the public IP"
if [[ $IP1 == 10.* ]]; then
  IP="$IP2";
else
  IP="$IP1";
fi
echo "Created Droplet at $IP"
sleep 90

ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no \
  root@"$IP" "mkdir -p docker-whatsapp-communication"
scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no \
  ~/.dcycle-docker-credentials.sh \
  root@"$IP":~/.dcycle-docker-credentials.sh
scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no \
  -r ./* root@"$IP":docker-whatsapp-communication
ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no \
  root@"$IP" "cd docker-whatsapp-communication && ./scripts/ci.sh"
