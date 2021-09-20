#!/usr/bin/env bash

export $(egrep -v '^#' .env | xargs)
NETWORK="hardhat"
POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -n|--network)
    NETWORK="$2"
    shift
    shift
    ;;
    -k|--key)
    ETHERSCAN_API_KEY="$2"
    shift
    shift
    ;;
    *)
    POSITIONAL+=("$1")
    shift
    ;;
esac
done
set -- "${POSITIONAL[@]}"

npx hardhat etherscan-verify --network ${NETWORK} --api-key ${ETHERSCAN_API_KEY}
