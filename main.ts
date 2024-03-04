let MODE: number = 0

let joystick: number = 0
let increment: number = 0
let speedfactor: number = 0
let moveamount: number = 0

let degrees_calc: number = 0
let degrees_calc2: number = 0

let button_count_A: number = 0
let button_count_B: number = 0
let button_count_C: number = 0
let movement_acc: number = 0

serial.redirect(
    SerialPin.USB_TX,
    SerialPin.USB_RX,
    BaudRate.BaudRate115200
)

serial.writeString("\n\n\nWelcome to dojo:bot App v4.3 (block 1.1.5)\n")
dojo.bot_init()



dojo.bot_servo_position(dojo.SERVO_ID.SERVO_LEFT, 90)
dojo.bot_servo_position(dojo.SERVO_ID.SERVO_RIGHT, 90)
dojo.bot_servo_position(dojo.SERVO_ID.SERVO_ROTATE, 90)
dojo.bot_servo_position(dojo.SERVO_ID.SERVO_JAW1, 90)
dojo.bot_servo_position(dojo.SERVO_ID.SERVO_JAW2, 90)

if (input.buttonIsPressed(Button.A)) {
    basic.showIcon(IconNames.Square)
    music.play(music.builtinPlayableSoundEffect(soundExpression.slide), music.PlaybackMode.UntilDone)
    MODE = 0
    dojo.bot_led_colour(dojo.LED_ID.LED1, dojo.COLOUR.RED)
    dojo.bot_led_colour(dojo.LED_ID.LED2, dojo.COLOUR.RED)
    dojo.bot_led_colour(dojo.LED_ID.LED3, dojo.COLOUR.RED)
} else {

    basic.showString("v4.3")

    basic.showIcon(IconNames.Heart)
    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)
    MODE = 1
    dojo.bot_led_colour(dojo.LED_ID.LED1, dojo.COLOUR.RED)
    dojo.bot_led_colour(dojo.LED_ID.LED2, dojo.COLOUR.RED)
    dojo.bot_led_colour(dojo.LED_ID.LED3, dojo.COLOUR.RED)

    //Set standard limits up
    dojo.servo_left_min = 60;
    dojo.servo_left_max = 180;
    dojo.servo_right_min = 0;
    dojo.servo_right_max = 120;
    dojo.servo_rotate_min = 0;
    dojo.servo_rotate_max = 180;
    dojo.servo_jaw1_min = 0;
    dojo.servo_jaw1_max = 90;
    dojo.servo_jaw2_min = 90;
    dojo.servo_jaw2_max = 180;
}

basic.forever(function () {
    if (MODE == 0) {
        // In servo calibration mode
        // On A -> send to 0
        if (pins.digitalReadPin(DigitalPin.P5) == 0) {
            serial.writeLine("A")
            basic.showString("A")
            dojo.bot_servo_position(dojo.SERVO_ID.SERVO_LEFT, 0)
            dojo.bot_servo_position(dojo.SERVO_ID.SERVO_RIGHT, 0)
            dojo.bot_servo_position(dojo.SERVO_ID.SERVO_ROTATE, 0)
            dojo.bot_servo_position(dojo.SERVO_ID.SERVO_JAW1, 0)
            dojo.bot_servo_position(dojo.SERVO_ID.SERVO_JAW2, 0)
        } else {
            // On B -> send to 180
            if (pins.digitalReadPin(DigitalPin.P11) == 0) {
                serial.writeLine("B")
                basic.showString("B")
                dojo.bot_servo_position(dojo.SERVO_ID.SERVO_LEFT, 180)
                dojo.bot_servo_position(dojo.SERVO_ID.SERVO_RIGHT, 180)
                dojo.bot_servo_position(dojo.SERVO_ID.SERVO_ROTATE, 180)
                dojo.bot_servo_position(dojo.SERVO_ID.SERVO_JAW1, 180)
                dojo.bot_servo_position(dojo.SERVO_ID.SERVO_JAW2, 180)
            } else {
                // On C -> send to 90
                if (pins.digitalReadPin(DigitalPin.P8) == 0) {
                    serial.writeLine("C")
                    basic.showString("C")
                    dojo.bot_servo_position(dojo.SERVO_ID.SERVO_LEFT, 90)
                    dojo.bot_servo_position(dojo.SERVO_ID.SERVO_RIGHT, 90)
                    dojo.bot_servo_position(dojo.SERVO_ID.SERVO_ROTATE, 90)
                    dojo.bot_servo_position(dojo.SERVO_ID.SERVO_JAW1, 90)
                    dojo.bot_servo_position(dojo.SERVO_ID.SERVO_JAW2, 90)
                }
            }
        }
    } else {
        
        //Read input from joystick

        speedfactor = (dojo.bot_input(dojo.ADC_CH.ADC_CH_KNOB) / 40) + 0.1
        movement_acc = 0

        //LEFT
        //Convert input to an increment
        joystick = dojo.bot_input(dojo.ADC_CH.ADC_CH_LEFTJOY_X)
        increment = dojo.bot_joy_to_move(joystick)
        //Factor increment by speed from slider (0 to 100 converted to 0 to 1)
        moveamount = increment * speedfactor
        //Send to servo
        dojo.bot_servo_position_rel(dojo.SERVO_ID.SERVO_LEFT, moveamount)
        movement_acc += moveamount
        //serial.writeLine(`LEFT j ${joystick} i ${increment} s ${speedfactor} m ${moveamount}`)

        //RIGHT
        //Convert input to an increment
        joystick = dojo.bot_input(dojo.ADC_CH.ADC_CH_RIGHTJOY_X)
        increment = dojo.bot_joy_to_move(joystick)
        //Factor increment by speed from slider (0 to 100 converted to 0 to 1)
        moveamount = increment * speedfactor
        //Send to servo
        dojo.bot_servo_position_rel(dojo.SERVO_ID.SERVO_RIGHT, moveamount)
        movement_acc += moveamount
        //serial.writeLine(`RIGHT j ${joystick} i ${increment} s ${speedfactor} m ${moveamount}`)
        
        //ROTATE
        //Convert input to an increment
        joystick = dojo.bot_input(dojo.ADC_CH.ADC_CH_LEFTJOY_Y)
        increment = dojo.bot_joy_to_move(joystick)
        //Factor increment by speed from slider (0 to 100 converted to 0 to 1)
        moveamount = increment * speedfactor
        //Send to servo
        dojo.bot_servo_position_rel(dojo.SERVO_ID.SERVO_ROTATE, moveamount)
        movement_acc += moveamount
        //serial.writeLine(`RIGHT j ${joystick} i ${increment} s ${speedfactor} m ${moveamount}`)

        //JAWS
        joystick = dojo.bot_input(dojo.ADC_CH.ADC_CH_SLIDE)
        //Returns a value 0 to 100 (ADC raw is 0 to 4095)
        if (joystick < 10) {
            degrees_calc = 90
            degrees_calc2 = 90
        } else {
            joystick += 0 - 10
            degrees_calc = 90 + joystick
            degrees_calc2 = 90 - joystick

            Math.constrain(degrees_calc, 0, 180)
            Math.constrain(degrees_calc2, 0, 180)
        }

        dojo.bot_servo_position(dojo.SERVO_ID.SERVO_JAW1, degrees_calc2)
        dojo.bot_servo_position(dojo.SERVO_ID.SERVO_JAW2, degrees_calc)

        //Display limits on LEDs
        //LEFT
        if ((dojo.servo_left_position == dojo.servo_left_min) || (dojo.servo_left_position == dojo.servo_left_max)) 
        {
            dojo.bot_led_colour(dojo.LED_ID.LED1, dojo.COLOUR.RED)
        }
        else if ((dojo.servo_left_position < (dojo.servo_left_min + 15)) || (dojo.servo_left_position > (dojo.servo_left_max - 15)))
        {
            dojo.bot_led_colour(dojo.LED_ID.LED1, dojo.COLOUR.ORANGE)
        }
        else 
        {
            dojo.bot_led_colour(dojo.LED_ID.LED1, dojo.COLOUR.GREEN)
        }
        //RIGHT
        if ((dojo.servo_right_position == dojo.servo_right_min) || (dojo.servo_right_position == dojo.servo_right_max)) 
        {
            dojo.bot_led_colour(dojo.LED_ID.LED3, dojo.COLOUR.RED)
        }
        else if ((dojo.servo_right_position < (dojo.servo_right_min + 15)) || (dojo.servo_right_position > (dojo.servo_right_max - 15))) {
            dojo.bot_led_colour(dojo.LED_ID.LED3, dojo.COLOUR.ORANGE)
        }
        else {
            dojo.bot_led_colour(dojo.LED_ID.LED3, dojo.COLOUR.GREEN)
        }

        //Monitor buttons for go to position and store position
        if (pins.digitalReadPin(DigitalPin.P5) == 0) {
            button_count_A += 1
            button_count_B = 0
            if (button_count_A == 50) {
                music.play(music.tonePlayable(494, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
            }
        }
        else {
            if (button_count_A >= 50) {
                //3 seconds so store position
                button_count_A = 0
                //basic.showString("A")
                serial.writeLine(`Store A`)
                dojo.positionA_left = dojo.servo_left_position
                dojo.positionA_right = dojo.servo_right_position
                dojo.positionA_rotate = dojo.servo_rotate_position
            }
            else if (button_count_A >= 1) {
                //Quick release so go
                button_count_A = 0
                //basic.showString("A")
                serial.writeLine(`Go A`)
                dojo.bot_servo_position(dojo.SERVO_ID.SERVO_LEFT, dojo.positionA_left)
                dojo.bot_servo_position(dojo.SERVO_ID.SERVO_RIGHT, dojo.positionA_right)
                dojo.bot_servo_position(dojo.SERVO_ID.SERVO_ROTATE, dojo.positionA_rotate)
            }
        }

        if (pins.digitalReadPin(DigitalPin.P11) == 0) {
            button_count_B += 1
            button_count_A = 0
            if (button_count_B == 50) {
                music.play(music.tonePlayable(494, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
            }
        }
        else {
            if (button_count_B >= 50) {
                //3 seconds so store position
                button_count_B = 0
                //basic.showString("B")
                serial.writeLine(`Store B`)
                dojo.positionB_left = dojo.servo_left_position
                dojo.positionB_right = dojo.servo_right_position
                dojo.positionB_rotate = dojo.servo_rotate_position
            }
            else if (button_count_B >= 1) {
                //Quick release so go
                button_count_B = 0
                //basic.showString("B")
                serial.writeLine(`Go B`)
                dojo.bot_servo_position(dojo.SERVO_ID.SERVO_LEFT, dojo.positionB_left)
                dojo.bot_servo_position(dojo.SERVO_ID.SERVO_RIGHT, dojo.positionB_right)
                dojo.bot_servo_position(dojo.SERVO_ID.SERVO_ROTATE, dojo.positionB_rotate)
            }
        }

        if (pins.digitalReadPin(DigitalPin.P8) == 0) {
            serial.writeLine(`L ${dojo.servo_left_position} R ${dojo.servo_right_position} RT ${dojo.servo_rotate_position} J1 ${dojo.servo_jaw1_position} J2 ${dojo.servo_jaw2_position}`)
        }

        //Any movement will reset position indicator
        //if (movement_acc > 0) {
        //    basic.showIcon(IconNames.SmallHeart)
        //}

        basic.pause(30)

    }
})