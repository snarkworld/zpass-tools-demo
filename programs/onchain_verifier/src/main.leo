// The 'onchain_verifier' program.
import onchain_issuer.leo;

program onchain_verifier.aleo {

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

    transition verify_dob(
        rec: onchain_issuer.leo/SignedCredential.record,
        dob: u32,
        currentDate: u32
    ) -> bool {
        // Check the owner
        assert_eq(self.caller, rec.owner);

        // Comparison of the subject an owner
        assert_eq(rec.subject, rec.owner);

        // Expiration of record time verficiation
        assert(rec.expiry.gte(currentDate));

        // Verfiy of dob field
        return rec.dob.eq(dob);
    }

    transition verify_nationality(
        rec: onchain_issuer.leo/SignedCredential.record,
        nationality: field,
        currentDate: u32
    ) -> bool {
        // Check the owner
        assert_eq(self.caller, rec.owner);

        // Comparison of the subject an owner
        assert_eq(rec.subject, rec.owner);

        // Expiration of record time verficiation
        assert(rec.expiry.gte(currentDate));

        // Verfiy of nationality field
        return rec.nationality.eq(nationality);
    }

    transition verify_age_condition(
        rec: onchain_issuer.leo/SignedCredential.record,
        age: u32,
        condition: u8,
        currentDate: u32
    ) -> bool {
        assert_eq(self.caller, rec.owner);

        let dob: date_time = timestamp_to_datetime(rec.dob);
        let current: date_time = timestamp_to_datetime(currentDate);
        let ages: u32 = current.year - dob.year;

        if ( condition.eq(0u8)) {
            return ages.gte(age);
        } else if (condition.eq(1u8)) {
            return ages.gt(age);
        } else if (condition.eq(2u8)) {
            return ages.lte(age);
        } else if (condition.eq(3u8)) {
            return ages.lt(age);
        } else {
            return ages.eq(age);
        }
    }
}
