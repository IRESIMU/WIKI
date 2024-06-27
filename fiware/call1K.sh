#!/bin/bash

start_time=$(date +%s%N)  # Start time in nanoseconds

for i in {1..1000}; do
  curl localhost:9090/ngsi-ld/v1/entities/smartcity%3Ahouses%3Ahouse2 -s -S -H 'Accept: application/ld+json' > /dev/null
done

end_time=$(date +%s%N)  # End time in nanoseconds

elapsed=$((end_time - start_time))
elapsed_ms=$((elapsed / 1000000))  # Convert to milliseconds

echo "Elapsed time: $elapsed_ms ms"
