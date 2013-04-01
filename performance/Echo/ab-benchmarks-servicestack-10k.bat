IF "%1"=="" (
     SET concurrency=1
) ELSE (
     SET concurrency=%1
)

ab -n 10000 -c %concurrency% -p row-1.txt -dS "http://127.0.0.1:3000/text" > results/servicestack-c%concurrency%-n10000-row-1.txt

ab -n 10000 -c %concurrency% -p row-1.txt -dS "http://127.0.0.1:3000/json" > results/servicestack-c%concurrency%-n10000-row-1.json

ab -n 10000 -c %concurrency% -p row-10.txt -dS "http://127.0.0.1:3000/text" > results/servicestack-c%concurrency%-n10000-row-10.txt

ab -n 10000 -c %concurrency% -p row-10.txt -dS "http://127.0.0.1:3000/json" > results/servicestack-c%concurrency%-n10000-row-10.json

ab -n 10000 -c %concurrency% -p row-100.txt -dS "http://127.0.0.1:3000/text" > results/servicestack-c%concurrency%-n10000-row-100.txt

ab -n 10000 -c %concurrency% -p row-100.txt -dS "http://127.0.0.1:3000/json" > results/servicestack-c%concurrency%-n10000-row-100.json
