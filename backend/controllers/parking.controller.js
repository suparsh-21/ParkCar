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


module.exports={createParkingController,getNearbyParkingController}