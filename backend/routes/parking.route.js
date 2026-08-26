const express = require("express");

const {
    createParkingController,
    getNearbyParkingController,
    getMyParkingsController,
    updateParkingController,
    toggleParkingController
} = require("../controllers/parking.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const router = express.Router();


/**
 * @swagger
 * /api/parking:
 *   post:
 *     summary: Create a parking lot
 *     description: Creates a new parking lot for the authenticated owner.
 *     tags:
 *       - Parking
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - latitude
 *               - longitude
 *               - total_slots
 *               - price_per_hour
 *             properties:
 *               name:
 *                 type: string
 *                 example: HBlock Underground Parking
 *               address:
 *                 type: string
 *                 example: Hostel Block H, Ahmedabad
 *               latitude:
 *                 type: number
 *                 example: 23.0225
 *               longitude:
 *                 type: number
 *                 example: 72.5714
 *               total_slots:
 *                 type: integer
 *                 example: 50
 *               price_per_hour:
 *                 type: number
 *                 example: 30
 *     responses:
 *       200:
 *         description: Parking lot created successfully
 *       400:
 *         description: Invalid parking details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only owners can create parking lots
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("OWNER"),
    createParkingController
);


/**
 * @swagger
 * /api/parking/nearby:
 *   get:
 *     summary: Find nearby parking
 *     description: Returns available open parking lots sorted by distance.
 *     tags:
 *       - Parking
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         example: 23.0225
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         example: 72.5714
 *       - in: query
 *         name: start_time
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: 2026-08-26T18:00:00Z
 *       - in: query
 *         name: end_time
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: 2026-08-26T20:00:00Z
 *     responses:
 *       200:
 *         description: Nearby parking fetched successfully
 *       400:
 *         description: Invalid location or time parameters
 *       500:
 *         description: Internal server error
 */
router.get(
    "/nearby",
    getNearbyParkingController
);


/**
 * @swagger
 * /api/parking/my:
 *   get:
 *     summary: Get owner's parking lots
 *     description: Returns all parking lots owned by the authenticated owner.
 *     tags:
 *       - Parking
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Owner parking lots fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only owners can access this endpoint
 *       500:
 *         description: Internal server error
 */
router.get(
    "/my",
    authMiddleware,
    roleMiddleware("OWNER"),
    getMyParkingsController
);


/**
 * @swagger
 * /api/parking/{parking_id}:
 *   patch:
 *     summary: Update a parking lot
 *     description: Updates the details of a parking lot owned by the authenticated owner.
 *     tags:
 *       - Parking
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: parking_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - total_slots
 *               - price_per_hour
 *             properties:
 *               name:
 *                 type: string
 *                 example: HBlock Underground Parking
 *               address:
 *                 type: string
 *                 example: Hostel Block H, Ahmedabad
 *               total_slots:
 *                 type: integer
 *                 example: 50
 *               price_per_hour:
 *                 type: number
 *                 example: 30
 *     responses:
 *       200:
 *         description: Parking updated successfully
 *       400:
 *         description: Invalid parking details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User is not authorized to update this parking
 *       404:
 *         description: Parking lot not found
 *       500:
 *         description: Internal server error
 */
router.patch(
    "/:parking_id",
    authMiddleware,
    roleMiddleware("OWNER"),
    updateParkingController
);


/**
 * @swagger
 * /api/parking/{parking_id}/toggle:
 *   patch:
 *     summary: Toggle parking availability
 *     description: Opens or closes a parking lot owned by the authenticated owner.
 *     tags:
 *       - Parking
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: parking_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Parking opened or closed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User is not authorized to manage this parking
 *       404:
 *         description: Parking lot not found
 *       500:
 *         description: Internal server error
 */
router.patch(
    "/:parking_id/toggle",
    authMiddleware,
    roleMiddleware("OWNER"),
    toggleParkingController
);


module.exports = router;