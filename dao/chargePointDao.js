/**
 * Created by kennethobikwelu on 8/1/17.
 */

'use strict';

var mongoJs = require('mongojs');
var mongo = require('../config');
var port = 15214;
var mongoDBChargePointMetaData = mongoJs('mongodb://' + mongo.keys.mongo_user + ':' + mongo.keys.mongo_password + '@ds115214.mlab.com:' + port + '/evpoint', [mongo.keys.mongo_collection_chargePointMetaData]);
var mongoDBChargePoints = mongoJs('mongodb://' + mongo.keys.mongo_user + ':' + mongo.keys.mongo_password + '@ds115214.mlab.com:' + port + '/evpoint', [mongo.keys.mongo_collection_chargePoint]);
var mongoDBCPTest = mongoJs('mongodb://' + mongo.keys.mongo_user + ':' + mongo.keys.mongo_password + '@ds115214.mlab.com:' + port + '/evpoint', [mongo.keys.mongo_collection_test]);

module.exports = function () {
	/**
	 *
	 * @param table
	 * @param res
	 */
	var getAllChargingPoints = function (table, res) {
		if (table === 'chargePoints') {
			console.log('Starting get query for charging points');
			mongoDBChargePoints.EV_ChargePoints.find({}, {
				access_days_time       : 1,
				cards_accepted         : 1,
				date_last_confirmed    : 1,
				expected_date          : 1,
				fuel_type_code         : 1,
				id                     : 1,
				groups_with_access_code: 1,
				open_date              : 1,
				owner_type_code        : 1,
				status_code            : 1,
				station_name           : 1,
				station_phone          : 1,
				updated_at             : 1,
				geocode_status         : 1,
				city                   : 1,
				intersection_directions: 1,
				plus4                  : 1,
				state                  : 1,
				street_address         : 1,
				zip                    : 1,
				bd_blends              : 1,
				e85_blender_pump       : 1,
				ev_connector_types     : 1,
				ev_dc_fast_num         : 1,
				ev_level1_evse_num     : 1,
				ev_level2_evse_num     : 1,
				ev_network             : 1,
				ev_network_web         : 1,
				ev_other_evse          : 1,
				hy_status_link         : 1,
				lpg_primary            : 1,
				ng_fill_type_code      : 1,
				ng_psi                 : 1,
				ng_vehicle_class       : 1,
				station                : 1,
				posts                  : 1,
				location               : 1
			}, {limit: 300}, function (err, docs) {
				if (err || typeof docs[0] === 'undefined') {
					res.status(503);
					res.json({
						"status" : 503,
						"message": "Something went wrong, please try again later"
					});
				}
				else {
					res.json(docs);
				}
			})
		}
	};

	/**
	 *
	 * @param table
	 * @param res
	 */
	var getChargingPointsMetaData = function (table, res) {
		if (table === 'chargePointMetaData') {
			console.log('Starting get query for charging points meta data');
			mongoDBChargePointMetaData.EV_ChargePointMetaData.find({}, function (err, docs) {
				if (err || typeof docs[0] === 'undefined') {
					res.status(503);
					res.json({
						"status" : 503,
						"message": "Something went wrong, please try again later"
					});
				}
				else {
					res.json(docs)
				}
			})
		}
	};

	/**
	 *
	 * @param table
	 * @param item
	 * @param res
	 */
	var getAllChargingPointsBy = function (table, item, res) {
		if (table === 'chargePoints') {
			console.log('Starting get query for charging points by location.....');
			mongoDBChargePoints.EV_ChargePoints.ensureIndex({"location": "2d"});
			mongoDBChargePoints.EV_ChargePoints.find({
					"location": {
						$near       : [parseFloat(item[0]), parseFloat(item[1])],
						$maxDistance: 0.0049087385212341975
					}
				}, {
					access_days_time       : 1,
					cards_accepted         : 1,
					date_last_confirmed    : 1,
					expected_date          : 1,
					fuel_type_code         : 1,
					id                     : 1,
					groups_with_access_code: 1,
					open_date              : 1,
					owner_type_code        : 1,
					status_code            : 1,
					station_name           : 1,
					station_phone          : 1,
					updated_at             : 1,
					geocode_status         : 1,
					city                   : 1,
					intersection_directions: 1,
					plus4                  : 1,
					state                  : 1,
					street_address         : 1,
					zip                    : 1,
					bd_blends              : 1,
					e85_blender_pump       : 1,
					ev_connector_types     : 1,
					ev_dc_fast_num         : 1,
					ev_level1_evse_num     : 1,
					ev_level2_evse_num     : 1,
					ev_network             : 1,
					ev_network_web         : 1,
					ev_other_evse          : 1,
					hy_status_link         : 1,
					lpg_primary            : 1,
					ng_fill_type_code      : 1,
					ng_psi                 : 1,
					ng_vehicle_class       : 1,
					station                : 1,
					posts                  : 1,
					location               : 1
				}, function (err, docs) {
					if (err) {
						res.status(503);
						res.json({
							"status" : 503,
							"message": "Something went wrong, please try again later "
						});
					}
					else {
						res.json(docs);
					}
				}
			)
		}
	};

	var updateChargingPoint = function (table, item, res) {
		if (table === 'chargePoints') {
			console.log('Starting update charging point query.....');
			var count = item.length;
			if (count > 2) {
				if (item[2] === null){
					//do nothing
				} else {
					mongoDBChargePoints.EV_ChargePoints.update({"location": [parseFloat(item[0]), parseFloat(item[1])]}, {
						$push: {
							"comments": [new Date().toLocaleString(), item[2][1]]
						}
					}, function(err){
						if (err) {
							res.status(503);
							res.json({
								"status" : 503,
								"message": "Something went wrong, please try again later "
							});
						}
					})
				}
				if (item[3] === null){
					//do nothing
				} else {
					mongoDBChargePoints.EV_ChargePoints.update({"location": [parseFloat(item[0]), parseFloat(item[1])]}, {
						$push: {
							"images": [item[3][1]]
						}
					}, function(err){
						if (err) {
							res.status(503);
							res.json({
								"status" : 503,
								"message": "Something went wrong, please try again later "
							});
						}
					})
				}
				if (item[4] === null){
					//do nothing
				} else {
					mongoDBChargePoints.EV_ChargePoints.update({"location": [parseFloat(item[0]), parseFloat(item[1])]}, {
						$set: {
							"rating": item[4][1]
						}
					}, function(err){
						if (err) {
							res.status(503);
							res.json({
								"status" : 503,
								"message": "Something went wrong, please try again later "
							});
						}
					})
				}
				if (item[5] === null){
					//do nothing
				} else {
					mongoDBChargePoints.EV_ChargePoints.update({"location": [parseFloat(item[0]), parseFloat(item[1])]}, {
						$set: {
							"isCheckedIn": item[5][1]
						}
					}, function(err){
						if (err) {
							res.status(503);
							res.json({
								"status" : 503,
								"message": "Something went wrong, please try again later "
							});
						}
					})
				}
				if (item[6] === null){
					//do nothing
				} else {
					mongoDBChargePoints.EV_ChargePoints.update({"location": [parseFloat(item[0]), parseFloat(item[1])]}, {
						$set: {
							"timeCheckedIn": item[6][1]
						}
					}, function(err){
						if (err) {
							res.status(503);
							res.json({
								"status" : 503,
								"message": "Something went wrong, please try again later "
							});
						}
					})
				}
				if (item[7] === null){
					//do nothing
				} else {
					mongoDBChargePoints.EV_ChargePoints.update({"location": [parseFloat(item[0]), parseFloat(item[1])]}, {
						$set: {
							"intendedDurationOfUse": item[7][1]
						}
					}, function(err){
						if (err) {
							res.status(503);
							res.json({
								"status" : 503,
								"message": "Something went wrong, please try again later "
							});
						}
					})
				}
				res.status(200);
				res.json({
					"status" : 200,
					"message": "Update successful "
				});
			}
		}
	};

	var getChargingPointMetaData = function (table, item, res) {
		if (table === 'chargePoints') {
			console.log('Starting get query for charging points by location.....');
			mongoDBChargePoints.EV_ChargePoints.ensureIndex({"location": 1});
			mongoDBChargePoints.EV_ChargePoints.find({"location": [parseFloat(item[0]), parseFloat(item[1])]}, {
				rating               : 1,
				isCheckedIn          : 1,
				timeCheckedIn        : 1,
				intendedDurationOfUse: 1,
				comments             : 1,
				images               : 1
			}, {limit: 1}, function (err, docs) {
				if (err) {
					res.status(503);
					res.json({
						"status" : 503,
						"message": "Something went wrong, please try again later"
					});
				}
				else {
					res.json(docs);
				}
			})
		}
	};

	return {
		getAllChargingPoints     : function (table, res) {
			console.log('***** CHARGINGPOINT DAO .....');
			getAllChargingPoints(table, res)
		},
		getChargingPointsMetaData: function (table, res) {
			console.log('***** CHARGINGPOINTMETADATA DAO .....');
			getChargingPointsMetaData(table, res)
		},
		getAllChargingPointsBy   : function (table, item, res) {
			console.log('***** CHARGEPOINTSBY DAO .....');
			getAllChargingPointsBy(table, item, res)
		},
		updateChargingPoint      : function (table, item, res) {
			console.log('***** UPDATECHARGEPOINT DAO .....');
			updateChargingPoint(table, item, res)
		},
		getChargingPointMetaData : function (table, item, res) {
			console.log('***** CHARGEPOINTMETADATA DAO .....');
			getChargingPointMetaData(table, item, res)
		}
	}
}
