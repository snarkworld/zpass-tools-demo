// The 'datetime' program.
program datetime.aleo {

    struct date_time {
        seconds: u8,        // Seconds in the time
        minutes: u8,        // Minutes in the time
        hours: u8,          // Hours in the time
        day: u8,            // Day of the month
        month: u32,          // Month of the year
        year: u32,          // Year
    }

    function timestamp_to_datetime(t: u32) -> date_time {
        let seconds: u32 = t % 60u32;
        t /= 60u32;

        let minutes: u32 = t % 60u32;
        t /= 60u32;

        let hours: u32 = t % 24u32;
        t /= 24u32;

        let a: u32 = (4u32 * t + 102032u32) / 146097u32 + 15u32;
        let b: u32 = t + 2442113u32 + a - (a / 4u32);
        let c: u32 = (20u32 * b - 2442u32) / 7305u32;
        let d: u32 = b - 365u32 * c - (c / 4u32);
        let e: u32 = d * 1000u32 / 30601u32;
        let f: u32 = d - e * 30u32 - e * 601u32 / 1000u32;
        let g: u32 = 4716u32;
        let h: u32 = 1u32;

        if (e > 13u32) {
            g = 4715u32;
            h = 13u32;
        }

        c -= g;
        e -= h;

        let dt: date_time = date_time {
            seconds: seconds as u8,
            minutes: minutes as u8,
            hours: hours as u8,
            day: f as u8,
            month: e as u32,
            year: c as u32,
        };

        return dt;
    }

    function datetime_to_timestamp(dt: date_time) -> u32 {
        let y: u32 = dt.year as u32;
        let m: u32 = dt.month as u32;
        let d: u32 = dt.day as u32;

        if (m <= 2u32) {
            m += 12u32;
            y -= 1u32;
        }

        let t: u32 = (365u32 * y) + (y / 4u32) - (y / 100u32) + (y / 400u32);
        t += (30u32 * m) + (3u32 * (m + 1u32) / 5u32) + d;
        t -= 719561u32;
        t *= 86400u32;
        t += (3600u32 * dt.hours as u32) + (60u32 * dt.minutes as u32) + dt.seconds as u32;

        return t;
    }

    transition main(time: u32) -> (date_time, u32) {
        let dt: date_time = timestamp_to_datetime(time);
        let timestamp: u32 = datetime_to_timestamp(dt);
        assert_eq(timestamp, time);
        return (dt, timestamp);
    }
}
