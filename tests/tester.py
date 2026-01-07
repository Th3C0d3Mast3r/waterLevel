import tomllib
import requests

BASE_URL="http://localhost:8808"

with open("routes.toml","rb") as f:
    config=tomllib.load(f)

for route in config["route"]:
    print("="*50)
    print("TEST:",route["name"])

    method=route["method"]
    url=BASE_URL+route["url"]
    expected=route["expected_status"]

    headers=route.get("headers",{})
    body=route.get("body",None)

    if method=="GET":
        response=requests.get(url,headers=headers)
    elif method=="POST":
        response=requests.post(url,headers=headers,json=body)
    else:
        print("Unsupported method:",method)
        continue

    print("URL:",url)
    print("Expected:",expected)
    print("Actual:",response.status_code)

    if response.status_code==expected:
        print("STATUS: ✅")
    else:
        print("STATUS: ❌")

    print("Response Body:")
    print(response.text)
