let MODE: number = 0

serial.redirect(
    SerialPin.USB_TX,
    SerialPin.USB_RX,
    BaudRate.BaudRate9600
)
serial.writeString("Welcome to dojo:bot App v4.0")
dojo.bot_init()
dojo.bot_servo_position(dojo.SERVO_ID.SERVO_ALL, 90)
if (input.buttonIsPressed(Button.A)) {
    dojo.bot_led_colour(dojo.LED_ID.LED1, dojo.COLOUR.RED)
    dojo.bot_led_colour(dojo.LED_ID.LED2, dojo.COLOUR.RED)
    dojo.bot_led_colour(dojo.LED_ID.LED3, dojo.COLOUR.RED)
    basic.showIcon(IconNames.Square)
    music.play(music.builtinPlayableSoundEffect(soundExpression.slide), music.PlaybackMode.UntilDone)
    MODE = 0
} else {
    dojo.bot_led_colour(dojo.LED_ID.LED1, dojo.COLOUR.GREEN)
    dojo.bot_led_colour(dojo.LED_ID.LED2, dojo.COLOUR.GREEN)
    dojo.bot_led_colour(dojo.LED_ID.LED3, dojo.COLOUR.GREEN)
    basic.showString("v4.0")
    basic.showIcon(IconNames.Heart)
    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)
    MODE = 1
}
basic.forever(function () {
    if (MODE == 0) {
        // In servo calibration mode
        // On A -> send to 0
        if (pins.digitalReadPin(DigitalPin.P5) == 0) {
            serial.writeLine("A")
            basic.showString("A")
            dojo.bot_servo_position(dojo.SERVO_ID.SERVO_ALL, 0)
        } else {
            // On B -> send to 180
            if (pins.digitalReadPin(DigitalPin.P11) == 0) {
                serial.writeLine("B")
                basic.showString("B")
                dojo.bot_servo_position(dojo.SERVO_ID.SERVO_ALL, 180)
            } else {
                // On C -> send to 90
                if (pins.digitalReadPin(DigitalPin.P8) == 0) {
                    serial.writeLine("C")
                    basic.showString("C")
                    dojo.bot_servo_position(dojo.SERVO_ID.SERVO_ALL, 90)
                }
            }
        }
    }
    else {    //MODE=1
        let increment: number = 0
        let speedfactor: number = 0
        //Read input from joystick
        //Convert input to an increment
        increment = dojo.bot_joy_to_move(dojo.bot_input(dojo.ADC_CH.ADC_CH_LEFTJOY_Y))
        //Factor increment by speed from slider
        speedfactor = dojo.bot_input(dojo.ADC_CH.ADC_CH_LEFTJOY_Y) / 10
        increment *= speedfactor
        //Send to servo
        dojo.bot_servo_position_rel(dojo.SERVO_ID.SERVO_LEFT, increment)

        basic.pause(100)
    }
})