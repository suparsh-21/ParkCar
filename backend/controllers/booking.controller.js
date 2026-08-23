const pool= require('../config/db')

async function createBookingController(req,res){
try{
    const{parking_lot_id,start_time,end_time}=req.body
if(!parking_lot_id || !start_time ||!end_time){
    return res.status(400).json({message:"All fields are required"})
}
//Get parking information
const parkingResult=await pool.query(`SELECT * FROM parking_lots WHERE id=$1`,[parking_lot_id])
if(parkingResult.rows.length===0){
    return res.status(404).json({message:"Parking lot not found"})
}
const parking= parkingResult.rows[0]
if(!parking.is_open || parking.available_slots<=0){
    return res.status(400).json({message:"No parking slot is available"})
}

//calculate duration
const start=new Date(start_time)
const end= new Date(end_time)
if(end<=start){
    return res.status(400).json({message:"End time must be after start time !"})
}
//calculate amount
const durationInHours= (end-start)/(1000*60*60)
const amount=durationInHours*Number(parking.price_per_hour)

//create booking
 const result = await pool.query(
            `INSERT INTO bookings
            (user_id, parking_lot_id, start_time, end_time, amount)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                req.user.id,
                parking_lot_id,
                start_time,
                end_time,
                amount
            ]
        );
    return res.status(201).json({message:"Booking created successfully",booking:result.rows[0]})

}
catch(error){
    console.error("Booking creation error",error.message)
    return res.status(500).json({message:"Internal Server Error !"})
}
}


async function getMyBookingsController(req,res){
     try{
       const result = await pool.query(
            `SELECT
                b.id,
                b.parking_lot_id,
                p.name AS parking_name,
                p.address,
                b.start_time,
                b.end_time,
                b.amount,
                b.status,
                b.created_at
             FROM bookings b
             JOIN parking_lots p
             ON b.parking_lot_id = p.id
             WHERE b.user_id = $1
             ORDER BY b.created_at DESC`,
            [req.user.id]
        );
    return res.status(200).json({message:"Bookings fetched successfully !",bookings:result.rows})
}

catch(error){
    console.error("Get Bookings Error !",error.message)
    return res.status(500).json({message:"Internal Server Error !"})

}
}


async function cancelBookingController(req, res) {
    try {
        const { booking_id } = req.params;

        const bookingResult = await pool.query(
            `SELECT * FROM bookings WHERE id = $1`,
            [booking_id]
        );

        if (bookingResult.rows.length === 0) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const booking = bookingResult.rows[0];

        if (Number(booking.user_id) !== Number(req.user.id)) {
            return res.status(403).json({
                message: "You are not authorized to cancel this booking"
            });
        }

        if (booking.status !== "CONFIRMED") {
            return res.status(400).json({
                message: "Only confirmed bookings can be cancelled"
            });
        }

        // Cancel booking
        const result = await pool.query(
            `UPDATE bookings
             SET status = 'CANCELLED'
             WHERE id = $1
             RETURNING *`,
            [booking_id]
        );

        // Return the parking slot
        await pool.query(
            `UPDATE parking_lots
             SET available_slots = available_slots + 1
             WHERE id = $1`,
            [booking.parking_lot_id]
        );

        return res.status(200).json({
            message: "Booking cancelled successfully",
            booking: result.rows[0]
        });

    } catch (error) {
        console.error("Booking Cancellation Error!", error.message);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports={createBookingController,getMyBookingsController,cancelBookingController}