import network
import urequests  # Use urequests for HTTP POST to PC
from machine import Pin, time_pulse_us
from time import sleep, time

# === Wi-Fi Credentials ===
SSID = "*******"
PASSWORD = "*******"

# === PC Info ===
PC_IP = "192.168.1.16"  # Replace with your PC IP
PC_PORT = 8808            # Dashboard port where /esp-ack endpoint is listening

# === Ultrasonic Sensor Pins ===
trig = Pin(23, Pin.OUT)
echo = Pin(22, Pin.IN)

# === Pump Control Pin ===
pump = Pin(21, Pin.OUT)
pump.value(0)  # Start off

# === Connect to Wi-Fi ===
def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    print("Connecting to WiFi...")
    wlan.connect(SSID, PASSWORD)
    attempts = 0
    while not wlan.isconnected():
        sleep(1)
        attempts += 1
        print("Waiting...", attempts)
        if attempts > 15:
            print("Failed to connect. Check SSID/Password/2.4GHz.")
            return None
    ip = wlan.ifconfig()[0]
    print("Connected! IP:", ip)
    return ip

# === Ultrasonic Distance Function ===
def getDistance():
    trig.value(0)
    sleep(0.002)
    trig.value(1)
    sleep(0.00001)
    trig.value(0)
    duration = time_pulse_us(echo, 1, 25000)  # 25ms max
    distance = (duration * 0.0343) / 2
    return distance

# === Send ACK to PC ===
def send_ack():
    try:
        url = f"http://{PC_IP}:{PC_PORT}/esp-ack"
        payload={"ip":wlan.ifconfig()[0]}
        res = urequests.post(url, json=payload)
        res.close()
        print("ACK sent to PC")
    except Exception as e:
        print("Failed to send ACK:", e)

# === Main Loop ===
wlan = network.WLAN(network.STA_IF)
ip = connect_wifi()
if ip is None:
    raise SystemExit("WiFi connection failed")

# Send an initial ACK after connecting
send_ack()

while True:
    try:
        # Measure distance
        distance = getDistance()
        print("Distance:", round(distance, 2), "cm")

        # Example: if distance < threshold, turn pump ON
        # You can replace with your own logic
        if distance < 10:
            pump.value(1)
        else:
            pump.value(0)

        # Periodically send ACK to PC (every 10s)
        send_ack()

        sleep(10)
    except Exception as e:
        print("Error in main loop:", e)
        sleep(5)


# THIS CODE IS SUBJECT TO CHANGE