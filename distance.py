import RPi.GPIO as GPIO
import time
import requests

check = True

while True:
    GPIO.setmode(GPIO.BCM)

    TRIG = 22
    ECHO = 4

    print "Distance Measurement In Progress"

    GPIO.setup(TRIG,GPIO.OUT)
    GPIO.setup(ECHO,GPIO.IN)

    GPIO.output(TRIG, False)
    print "Waiting For Sensor To Settle"
    time.sleep(1)

    GPIO.output(TRIG, True)
    time.sleep(0.00001)
    GPIO.output(TRIG, False)

    while GPIO.input(ECHO)==0:
      pulse_start = time.time()

    while GPIO.input(ECHO)==1:
      pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start

    distance = pulse_duration * 17150

    distance = round(distance, 2)

    print "Distance:",distance,"cm"
    if distance < 100:
        if check == True:
            # send request show ads

            url = "http://localhost:1338/distance"

            querystring = {"distance":"show"}

            payload = ""
            response = requests.request("GET", url, data=payload, params=querystring)

            print(response.text)
            print("HIDE ADS")
            check  = False
    else:
        if check == False:
            # send request hide ads
            url = "http://localhost:1338/distance"

            querystring = {"distance":"hide"}

            payload = ""
            response = requests.request("GET", url, data=payload, params=querystring)

            print(response.text)
            print("SHOW ADSSSSSSSSSSSSSS")
            check = True

    GPIO.cleanup()
