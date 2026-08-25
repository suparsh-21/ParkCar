const pool=require('../config/db')
const calculateDistance=require("../utils/calculateDistance")

async function createParkingController(req,res){
    try{
        const{name,address,latitude,longitude,total_slots,price_per_hour}=req.body

        if(!name || !address || latitude===undefined || longitude===undefined || !total_slots || !price_per_hour){
            return res.status(400).json({message:"All fields are required"})
        }
            if(Number(total_slots)<=0){
    return res.status(400).json({
        message:"Total slots must be greater than 0"
    })
}

if(Number(price_per_hour)<=0){
    return res.status(400).json({
        message:"Price per hour must be greater than 0"
    })
}

if(Number(latitude)<-90 || Number(latitude)>90){
    return res.status(400).json({
        message:"Invalid latitude"
    })
}

if(Number(longitude)<-180 || Number(longitude)>180){
    return res.status(400).json({
        message:"Invalid longitude"
    })
}
        const result=await pool.query(
            `INSERT INTO parking_lots(
                owner_id,
                name,
                address,
                latitude,
                longitude,
                total_slots,
                available_slots,
                price_per_hour
            )
            VALUES($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *`,
            [
                req.user.id,
                name,
                address,
                latitude,
                longitude,
                total_slots,
                total_slots,
                price_per_hour
            ]
        )

        return res.status(200).json({
            message:"Parking lot created successfully !",
            parking:result.rows[0]
        })

    }
    catch(error){
        console.error("Parking Creation Error !",error.message)

        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}


async function getNearbyParkingController(req,res){
    try{
        const{latitude,longitude,start_time,end_time}=req.query

        if(!latitude || !longitude || !start_time || !end_time){
            return res.status(400).json({
                message:"Latitude, Longitude, Start time and End time is required"
            })
        }

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

        const result=await pool.query(
            `SELECT * FROM parking_lots
             WHERE is_open=true`
        )

        const nearbyParking=result.rows.map((parking)=>{
            const distance=calculateDistance(
                Number(latitude),
                Number(longitude),
                Number(parking.latitude),
                Number(parking.longitude)
            )

            return {
                ...parking,
                distance:Number(distance.toFixed(2))
            }
        })

        for(const parking of nearbyParking){

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
                    parking.id,
                    start_time,
                    end_time
                ]
            )

            const bookedSlots=Number(
                overlappingBookings.rows[0].count
            )

            parking.available_slots=Math.max(
                0,
                Number(parking.total_slots)-bookedSlots
            )
        }

        const availableParking=nearbyParking.filter(
            (parking)=>parking.available_slots>0
        )

        availableParking.sort(
            (a,b)=>a.distance-b.distance
        )

        return res.status(200).json({
            message:"nearby Parking Fetched successfully",
            parking:availableParking
        })
    }

    catch(error){
        console.error("Nearby Parking Error",error.message)

        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}


async function getMyParkingsController(req,res){
    try{

        const result=await pool.query(
            `SELECT *
             FROM parking_lots
             WHERE owner_id=$1
             ORDER BY created_at DESC`,
            [req.user.id]
        )

        return res.status(200).json({
            message:"Your parking lots fetched successfully",
            parking:result.rows
        })

    }
    catch(error){
        console.error("Get My Parking Error!",error.message)

        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}


async function updateParkingController(req,res){
    try{

        const{parking_id}=req.params

        const{
            name,
            address,
            total_slots,
            price_per_hour
        }=req.body

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

        if(Number(parking.owner_id)!==Number(req.user.id)){
            return res.status(403).json({
                message:"You are not authorized to update this parking"
            })
        }

        if(!name || !address || !total_slots || !price_per_hour){
            return res.status(400).json({
                message:"All parking details are required"
            })
        }

        const result=await pool.query(
            `UPDATE parking_lots
             SET name=$1,
                 address=$2,
                 total_slots=$3,
                 price_per_hour=$4
             WHERE id=$5
             RETURNING *`,
            [
                name,
                address,
                total_slots,
                price_per_hour,
                parking_id
            ]
        )

        return res.status(200).json({
            message:"Parking updated successfully",
            parking:result.rows[0]
        })

    }
    catch(error){
        console.error("Update Parking Error!",error.message)

        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}


async function toggleParkingController(req,res){
    try{

        const{parking_id}=req.params

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

        if(Number(parking.owner_id)!==Number(req.user.id)){
            return res.status(403).json({
                message:"You are not authorized to manage this parking"
            })
        }

        const result=await pool.query(
            `UPDATE parking_lots
             SET is_open=NOT is_open
             WHERE id=$1
             RETURNING *`,
            [parking_id]
        )

        return res.status(200).json({
            message:result.rows[0].is_open
                ? "Parking opened successfully"
                : "Parking closed successfully",
            parking:result.rows[0]
        })

    }
    catch(error){
        console.error("Toggle Parking Error!",error.message)

        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}


module.exports={
    createParkingController,
    getNearbyParkingController,
    getMyParkingsController,
    updateParkingController,
    toggleParkingController
}