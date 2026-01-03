import network
import urequests
from machine import Pin,time_pulse_us
from time import sleep,time

# ================= WIFI =================
SSID="*******"
PASSWORD="*******"

# ================= PC / BACKEND =================
PC_IP="192.168.1.16"     # your PC LAN IP
PC_PORT=8808

# ================= ULTRASONIC =================
trig=Pin(23,Pin.OUT)
echo=Pin(22,Pin.IN)

# ================= PUMP =================
pump=Pin(21,Pin.OUT)    # this is the switch that is for turning on/off the pump
pump.value(0)

# ================= WIFI CONNECT =================
def connect_wifi():
    wlan=network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID,PASSWORD)

    attempts=0
    while not wlan.isconnected():
        sleep(1)
        attempts+=1
        print("Connecting...",attempts)
        if attempts>15:
            return None

    print("Connected:",wlan.ifconfig()[0])
    return wlan

# ================= ULTRASONIC READ =================
def getDistance():
    trig.value(0)
    sleep(0.002)
    trig.value(1)
    sleep(0.00001)
    trig.value(0)

    duration=time_pulse_us(echo,1,25000)
    if duration<0:
        return None

    return (duration*0.0343)/2

# ================= ESP ACK =================
def send_ack(wlan):
    try:
        url=f"http://{PC_IP}:{PC_PORT}/esp-ack"
        payload={
            "ip":wlan.ifconfig()[0],
            "device":"ESP32",
            "ts":time()
        }
        headers={"Content-Type":"application/json"}

        res=urequests.post(url,json=payload,headers=headers)
        res.close()
        print("ESP ACK sent")
    except Exception as e:
        print("ACK failed:",e)

# ================= WATER LEVEL =================
def send_water_level(wlan,distance):
    try:
        url=f"http://{PC_IP}:{PC_PORT}/waterLevel"
        payload={
            "distance":round(distance,2),
            "ip":wlan.ifconfig()[0],
            "unit":"cm",
            "ts":time()
        }
        headers={"Content-Type":"application/json"}

        res=urequests.post(url,json=payload,headers=headers)
        res.close()
        print("Water level sent:",distance)
    except Exception as e:
        print("Water level send failed:",e)

# ================= MAIN =================
wlan=connect_wifi()
if wlan is None:
    raise SystemExit("WiFi failed")

# Initial ACK
send_ack(wlan)

last_ack=time()

while True:
    try:
        distance=getDistance()

        if distance is not None:
            # Pump logic (example)
            if distance<10:
                pump.value(1)
            else:
                pump.value(0)

            send_water_level(wlan,distance)

        # Send ACK every 10 seconds
        if time()-last_ack>10:
            send_ack(wlan)
            last_ack=time()

        sleep(2)

    except Exception as e:
        print("Loop error:",e)
        sleep(5)
