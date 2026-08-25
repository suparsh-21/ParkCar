const pool = require('../config/db')


async function createBookingController(req,res){
try{
    const{parking_lot_id,start_time,end_time}=req.body

    if(!parking_lot_id || !start_time || !end_time){
        return res.status(400).json({
            message:"All fields are required"
        })
    }

    // Get parking information
    const parkingResult=await pool.query(
        `SELECT * FROM parking_lots WHERE id=$1`,
        [parking_lot_id]
    )

    if(parkingResult.rows.length===0){
        return res.status(404).json({
            message:"Parking lot not found"
        })
    }

    const parking=parkingResult.rows[0]

    if(!parking.is_open){
        return res.status(400).json({
            message:"Parking lot is currently closed"
        })
    }

    // Calculate duration
    const start=new Date(start_time)
    const end=new Date(end_time)

    if(isNaN(start.getTime()) || isNaN(end.getTime())){
        return res.status(400).json({
            message:"Invalid start or end time"
        })
    }

    if(end<=start){
        return res.status(400).json({
            message:"End time must be after start time !"
        })
    }
    if(start < new Date()){
    return res.status(400).json({
        message:"Start time cannot be in the past"
    })
}

    // Check overlapping bookings
    const overlappingBookings=await pool.query(
        `SELECT COUNT(*)
         FROM bookings
         WHERE parking_lot_id=$1
         AND (
             status='CONFIRMED'
             OR (
                 status='PENDING'
                 AND payment_deadline>CURRENT_TIMESTAMP
             )
         )
         AND start_time<$3
         AND end_time>$2`,
        [
            parking_lot_id,
            start_time,
            end_time
        ]
    )

    const bookedSlots=Number(
        overlappingBookings.rows[0].count
    )

    if(bookedSlots>=Number(parking.total_slots)){
        return res.status(400).json({
            message:"No slot is available for this time period"
        })
    }

    // Calculate amount
    const durationInHours=
        (end-start)/(1000*60*60)

    const amount=
        durationInHours*Number(parking.price_per_hour)

    // Payment deadline
    const paymentDeadline=
        new Date(Date.now()+10*60*1000)

    // Create booking
    const result=await pool.query(
        `INSERT INTO bookings
        (
            user_id,
            parking_lot_id,
            start_time,
            end_time,
            amount,
            payment_deadline
        )
        VALUES($1,$2,$3,$4,$5,$6)
        RETURNING *`,
        [
            req.user.id,
            parking_lot_id,
            start_time,
            end_time,
            amount,
            paymentDeadline
        ]
    )

    return res.status(201).json({
        message:"Booking created successfully",
        booking:result.rows[0]
    })

}
catch(error){
    console.error(
        "Booking creation error",
        error.message
    )

    return res.status(500).json({
        message:"Internal Server Error !"
    })
}
}


async function getMyBookingsController(req,res){
try{

    const result=await pool.query(
        `SELECT
            b.id,
            b.parking_lot_id,
            p.name AS parking_name,
            p.address,
            b.start_time,
            b.end_time,
            b.amount,
            b.status,
            b.payment_deadline,
            b.created_at
         FROM bookings b
         JOIN parking_lots p
         ON b.parking_lot_id=p.id
         WHERE b.user_id=$1
         ORDER BY b.created_at DESC`,
        [req.user.id]
    )

    return res.status(200).json({
        message:"Bookings fetched successfully !",
        bookings:result.rows
    })

}
catch(error){
    console.error(
        "Get Bookings Error !",
        error.message
    )

    return res.status(500).json({
        message:"Internal Server Error !"
    })
}
}


async function cancelBookingController(req,res){

    const client=await pool.connect()

    try{

        const{booking_id}=req.params

        await client.query("BEGIN")

        // Get booking and lock it
        const bookingResult=await client.query(
            `SELECT * FROM bookings
             WHERE id=$1
             FOR UPDATE`,
            [booking_id]
        )

        if(bookingResult.rows.length===0){

            await client.query("ROLLBACK")

            return res.status(404).json({
                message:"Booking not found"
            })
        }

        const booking=bookingResult.rows[0]

        // Check booking owner
        if(Number(booking.user_id)!==Number(req.user.id)){

            await client.query("ROLLBACK")

            return res.status(403).json({
                message:"You are not authorized to cancel this booking"
            })
        }

        // Check booking status
        if(booking.status!=="CONFIRMED"){

            await client.query("ROLLBACK")

            return res.status(400).json({
                message:"Only confirmed bookings can be cancelled"
            })
        }

        // Check if booking has already ended
        if(new Date(booking.end_time)<=new Date()){

            await client.query("ROLLBACK")

            return res.status(400).json({
                message:"This booking has already ended and cannot be cancelled"
            })
        }

        // Cancel booking
        const result=await client.query(
            `UPDATE bookings
             SET status='CANCELLED'
             WHERE id=$1
             RETURNING *`,
            [booking_id]
        )

        // No available_slots update here.
        // Availability is calculated from bookings.

        await client.query("COMMIT")

        return res.status(200).json({
            message:"Booking cancelled successfully",
            booking:result.rows[0]
        })

    }
    catch(error){

        await client.query("ROLLBACK")

        console.error(
            "Booking Cancellation Error!",
            error.message
        )

        return res.status(500).json({
            message:"Internal Server Error"
        })

    }
    finally{

        client.release()

    }
}


async function getParkingBookingsController(req,res){
try{

    const{parking_id}=req.params

    // Check if parking exists
    const parkingResult=await pool.query(
        `SELECT * FROM parking_lots
         WHERE id=$1`,
        [parking_id]
    )

    if(parkingResult.rows.length===0){
        return res.status(404).json({
            message:"Parking lot not found"
        })
    }

    const parking=parkingResult.rows[0]

    // Check owner
    if(Number(parking.owner_id)!==Number(req.user.id)){
        return res.status(403).json({
            message:"You are not authorized to view these bookings"
        })
    }

    const result=await pool.query(
        `SELECT
            b.id,
            b.user_id,
            u.name AS driver_name,
            u.email AS driver_email,
            b.start_time,
            b.end_time,
            b.amount,
            b.status,
            b.payment_deadline,
            b.created_at
         FROM bookings b
         JOIN users u
         ON b.user_id=u.id
         WHERE b.parking_lot_id=$1
         ORDER BY b.created_at DESC`,
        [parking_id]
    )

    return res.status(200).json({
        message:"Parking bookings fetched successfully",
        bookings:result.rows
    })

}
catch(error){

    console.error(
        "Get Parking Bookings Error!",
        error.message
    )

    return res.status(500).json({
        message:"Internal Server Error"
    })
}
}


module.exports={
    createBookingController,
    getMyBookingsController,
    cancelBookingController,
    getParkingBookingsController
}