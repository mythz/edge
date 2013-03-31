IF "%1"=="" (
     SET concurrency=1
) ELSE (
     SET concurrency=%1
)

ab -n 100 -c %concurrency% -p row-1.txt -dS "http://127.0.0.1:3000/node" > results/node-n100-row-1.txt
ab -n 100 -c %concurrency% -p row-1.txt -dS "http://127.0.0.1:3000/edge" > results/edge-n100-row-1.txt

ab -n 1000 -c %concurrency% -p row-1.txt -dS "http://127.0.0.1:3000/node" > results/node-n1000-row-1.txt
ab -n 1000 -c %concurrency% -p row-1.txt -dS "http://127.0.0.1:3000/edge" > results/edge-n1000-row-1.txt

ab -n 10000 -c %concurrency% -p row-1.txt -dS "http://127.0.0.1:3000/node" > results/node-n10000-row-1.txt
ab -n 10000 -c %concurrency% -p row-1.txt -dS "http://127.0.0.1:3000/edge" > results/edge-n10000-row-1.txt


ab -n 100 -c %concurrency% -p row-1.txt -dS "http://127.0.0.1:3000/node/json" > results/node-n100-row-1.json
ab -n 100 -c %concurrency% -p row-1.txt -dS "http://127.0.0.1:3000/edge/json" > results/edge-n100-row-1.json

ab -n 1000 -c %concurrency% -p row-1.txt -dS "http://127.0.0.1:3000/node/json" > results/node-n1000-row-1.json
ab -n 1000 -c %concurrency% -p row-1.txt -dS "http://127.0.0.1:3000/edge/json" > results/edge-n1000-row-1.json

ab -n 10000 -c %concurrency% -p row-1.txt -dS "http://127.0.0.1:3000/node/json" > results/node-n10000-row-1.json
ab -n 10000 -c %concurrency% -p row-1.txt -dS "http://127.0.0.1:3000/edge/json" > results/edge-n10000-row-1.json




ab -n 100 -c %concurrency% -p row-10.txt -dS "http://127.0.0.1:3000/node" > results/node-n100-row-10.txt
ab -n 100 -c %concurrency% -p row-10.txt -dS "http://127.0.0.1:3000/edge" > results/edge-n100-row-10.txt

ab -n 1000 -c %concurrency% -p row-10.txt -dS "http://127.0.0.1:3000/node" > results/node-n1000-row-10.txt
ab -n 1000 -c %concurrency% -p row-10.txt -dS "http://127.0.0.1:3000/edge" > results/edge-n1000-row-10.txt

ab -n 10000 -c %concurrency% -p row-10.txt -dS "http://127.0.0.1:3000/node" > results/node-n10000-row-10.txt
ab -n 10000 -c %concurrency% -p row-10.txt -dS "http://127.0.0.1:3000/edge" > results/edge-n10000-row-10.txt


ab -n 100 -c %concurrency% -p row-10.txt -dS "http://127.0.0.1:3000/node/json" > results/node-n100-row-10.json
ab -n 100 -c %concurrency% -p row-10.txt -dS "http://127.0.0.1:3000/edge/json" > results/edge-n100-row-10.json

ab -n 1000 -c %concurrency% -p row-10.txt -dS "http://127.0.0.1:3000/node/json" > results/node-n1000-row-10.json
ab -n 1000 -c %concurrency% -p row-10.txt -dS "http://127.0.0.1:3000/edge/json" > results/edge-n1000-row-10.json

ab -n 10000 -c %concurrency% -p row-10.txt -dS "http://127.0.0.1:3000/node/json" > results/node-n10000-row-10.json
ab -n 10000 -c %concurrency% -p row-10.txt -dS "http://127.0.0.1:3000/edge/json" > results/edge-n10000-row-10.json




ab -n 100 -c %concurrency% -p row-100.txt -dS "http://127.0.0.1:3000/node" > results/node-n100-row-100.txt
ab -n 100 -c %concurrency% -p row-100.txt -dS "http://127.0.0.1:3000/edge" > results/edge-n100-row-100.txt

ab -n 1000 -c %concurrency% -p row-100.txt -dS "http://127.0.0.1:3000/node" > results/node-n1000-row-100.txt
ab -n 1000 -c %concurrency% -p row-100.txt -dS "http://127.0.0.1:3000/edge" > results/edge-n1000-row-100.txt

ab -n 10000 -c %concurrency% -p row-100.txt -dS "http://127.0.0.1:3000/node" > results/node-n10000-row-100.txt
ab -n 10000 -c %concurrency% -p row-100.txt -dS "http://127.0.0.1:3000/edge" > results/edge-n10000-row-100.txt


ab -n 100 -c %concurrency% -p row-100.txt -dS "http://127.0.0.1:3000/node/json" > results/node-n100-row-100.json
ab -n 100 -c %concurrency% -p row-100.txt -dS "http://127.0.0.1:3000/edge/json" > results/edge-n100-row-100.json

ab -n 1000 -c %concurrency% -p row-100.txt -dS "http://127.0.0.1:3000/node/json" > results/node-n1000-row-100.json
ab -n 1000 -c %concurrency% -p row-100.txt -dS "http://127.0.0.1:3000/edge/json" > results/edge-n1000-row-100.json

ab -n 10000 -c %concurrency% -p row-100.txt -dS "http://127.0.0.1:3000/node/json" > results/node-n10000-row-100.json
ab -n 10000 -c %concurrency% -p row-100.txt -dS "http://127.0.0.1:3000/edge/json" > results/edge-n10000-row-100.json
