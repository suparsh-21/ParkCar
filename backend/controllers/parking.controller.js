const pool=require('../config/db')
const calculateDistance=require("../utils/calculateDistance")

async function createParkingController(req,res){
    try{
        const{name,address,latitude,longitude,total_slots,price_per_hour}=req.body
        if(!name || !address || latitude===undefined || longitude ===undefined || !total_slots || !price_per_hour){
            return res.status(400).json({message:"All fields are required"})
}
       const result = await pool.query(
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
);
        return res.status(200).json({message:"Parking lot created successfully !",parking:result.rows[0]})
}
catch(error){
    console.error("Parking Creation Error !",error.message)
    return res.status(500).json({message:"Internal Server Error"})
}
}

async function getNearbyParkingController(req,res){
    try{
        const{latitude,longitude}=req.query
        if(!latitude ||!longitude){
        return res.status(400).json({message:"Latitude and Longitude is required"})
    }

    const result=await pool.query(`SELECT * FROM parking_lots WHERE is_open=true AND available_slots>0`)
    const nearbyParking=result.rows.map((parking)=>{
        const distance=calculateDistance(Number(latitude),Number(longitude),Number(parking.latitude),Number(parking.longitude))
        return {...parking,distance:Number(distance.toFixed(2))}

})
nearbyParking.sort((a,b)=>a.distance-b.distance)
return res.status(200).json({message:"nearby Parking Fetched successfully",parking:nearbyParking})
}

catch(error){
        console.error("Nearby Parking Error",error.message)
    return res.status(500).json({message:"Internal Server Error"})

}


}

async function getMyParkingsController(req, res) {
    try {
        const result = await pool.query(
            `SELECT *
             FROM parking_lots
             WHERE owner_id = $1
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({
            message: "Your parking lots fetched successfully",
            parking: result.rows
        });

    } catch (error) {
        console.error("Get My Parking Error!", error.message);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
async function updateParkingController(req, res) {
    try {
        const { parking_id } = req.params;
        const {
            name,
            address,
            total_slots,
            price_per_hour
        } = req.body;

        const parkingResult = await pool.query(
            `SELECT * FROM parking_lots
             WHERE id = $1`,
            [parking_id]
        );

        if (parkingResult.rows.length === 0) {
            return res.status(404).json({
                message: "Parking lot not found"
            });
        }

        const parking = parkingResult.rows[0];

        if (Number(parking.owner_id) !== Number(req.user.id)) {
            return res.status(403).json({
                message: "You are not authorized to update this parking"
            });
        }

        if (!name || !address || !total_slots || !price_per_hour) {
            return res.status(400).json({
                message: "All parking details are required"
            });
        }

        if (total_slots < parking.total_slots - parking.available_slots) {
            return res.status(400).json({
                message: "Total slots cannot be less than occupied slots"
            });
        }

        const occupiedSlots =
            parking.total_slots - parking.available_slots;

        const newAvailableSlots =
            total_slots - occupiedSlots;

        const result = await pool.query(
            `UPDATE parking_lots
             SET name = $1,
                 address = $2,
                 total_slots = $3,
                 available_slots = $4,
                 price_per_hour = $5
             WHERE id = $6
             RETURNING *`,
            [
                name,
                address,
                total_slots,
                newAvailableSlots,
                price_per_hour,
                parking_id
            ]
        );

        return res.status(200).json({
            message: "Parking updated successfully",
            parking: result.rows[0]
        });

    } catch (error) {
        console.error("Update Parking Error!", error.message);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function toggleParkingController(req, res) {
    try {
        const { parking_id } = req.params;

        const parkingResult = await pool.query(
            `SELECT * FROM parking_lots
             WHERE id = $1`,
            [parking_id]
        );

        if (parkingResult.rows.length === 0) {
            return res.status(404).json({
                message: "Parking lot not found"
            });
        }

        const parking = parkingResult.rows[0];

        if (Number(parking.owner_id) !== Number(req.user.id)) {
            return res.status(403).json({
                message: "You are not authorized to manage this parking"
            });
        }

        const result = await pool.query(
            `UPDATE parking_lots
             SET is_open = NOT is_open
             WHERE id = $1
             RETURNING *`,
            [parking_id]
        );

        return res.status(200).json({
            message: result.rows[0].is_open
                ? "Parking opened successfully"
                : "Parking closed successfully",
            parking: result.rows[0]
        });

    } catch (error) {
        console.error("Toggle Parking Error!", error.message);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}



module.exports={createParkingController,getNearbyParkingController,getMyParkingsController,updateParkingController,toggleParkingController}