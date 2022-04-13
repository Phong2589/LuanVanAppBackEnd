const admin = require('../models/admin');
const bookTable = require('../models/bookTable');
const bookShip = require('../models/bookShip');
const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose')
const foodMenu = require('../models/foodMenu');
const ShortUniqueId = require('short-unique-id')
const uid = new ShortUniqueId({ length: 15 });
const idstaff = new ShortUniqueId({ length: 10 });
const sha256 = require('sha256');
const staff = require('../models/staff')
const infoStaff = require('../models/infoStaff')
const dinnerTable = require('../models/dinnerTable');
const order = require('../models/order');
const orderHistory = require('../models/orderHistory');
const warehouse = require('../models/warehouse');

const moment = require('moment');
const { query } = require('express');



class ChefController {

    async homeChef(req, res, next) {
        var orderFind = await order.find({})
        var dinnerTableFind = await dinnerTable.find({})
        var data = []
        for (var i = 0; i < dinnerTableFind.length; i++) {
            var temp = ""
            for (var j = 0; j < orderFind.length; j++) {
                if (dinnerTableFind[i].slug === orderFind[j].dinnerTable && (orderFind[j].state === "Chờ thanh toán" || orderFind[j].state === "Hoàn thành món")) {
                    temp = "luc"
                }
                if (dinnerTableFind[i].slug === orderFind[j].dinnerTable && (orderFind[j].state === "Đang xử lý")) {
                    temp = "cam"
                }
                if (dinnerTableFind[i].slug === orderFind[j].dinnerTable && (orderFind[j].state === "Đang chế biến")) {
                    temp = "duong"
                }
            }
            if (temp === "") {
                data[i] = {
                    nameTable: dinnerTableFind[i].name,
                    color: "White",
                    slug: dinnerTableFind[i].slug
                }
            }
            else if (temp === "luc") {
                data[i] = {
                    nameTable: dinnerTableFind[i].name,
                    color: "Green",
                    slug: dinnerTableFind[i].slug
                }
            }
            else if (temp === "duong") {
                data[i] = {
                    nameTable: dinnerTableFind[i].name,
                    color: "Blue",
                    slug: dinnerTableFind[i].slug
                }
            }
            else {
                data[i] = {
                    nameTable: dinnerTableFind[i].name,
                    color: "Orange",
                    slug: dinnerTableFind[i].slug
                }
            }
        }
        res.json(data)
    }


    async ConfirmOrder(req, res, next) {
        var table = req.query.table
        var user = req.query.user
        var staffTemp = await infoStaff.findOne({ userName: user })
        var orderTable = await order.findOne({ dinnerTable: table })
        var staffNew = orderTable.staff;
        staffNew[staffNew.length] = {
            id: idstaff(),
            userName: staffTemp.userName,
            name: staffTemp.name,
            position: staffTemp.position,
            act: "Xác nhận hóa đơn",
        }
        var result = await order.updateOne({ dinnerTable: table }, {
            staff: staffNew,
            state: "Đang chế biến"
        })
        if(result) res.json("ok")
        else res.json("error")
    }
    async deleteOrder(req,res,next){
        var table = req.query.table
        var user = req.query.user
        var staffTemp = await infoStaff.findOne({ userName: user })
        var orderTable = await order.findOne({ dinnerTable: table })
        var staffNew = orderTable.staff;
        staffNew[staffNew.length] = {
            id: idstaff(),
            userName: staffTemp.userName,
            name: staffTemp.name,
            position: staffTemp.position,
            act: "Hủy hóa đơn",
        }
        orderTable.staff = staffNew,
        orderTable.state = "Đã hủy"
        var orderHistoryNew = new orderHistory()
        orderHistoryNew.order = orderTable.order
        orderHistoryNew.staff = orderTable.staff
        orderHistoryNew.dinnerTable = orderTable.dinnerTable
        orderHistoryNew.note = orderTable.note
        orderHistoryNew.total = orderTable.total
        orderHistoryNew.dinnerTableName = orderTable.dinnerTableName
        orderHistoryNew.orderId = orderTable.orderId
        orderHistoryNew.state = orderTable.state

        var result2 = await order.deleteOne({dinnerTable: table})
        var result1 = await orderHistoryNew.save()

        if (result1 && result2) res.json("ok")
        else res.json("error")

    }

    async getNote(req,res,next){
        var orderTable = await order.findOne({ dinnerTable: req.query.table })
        res.json(orderTable.note)
    }

    async setNote(req,res,next){
        var orderTable = await order.findOne({ dinnerTable: req.body.table })
        var staffTemp = await infoStaff.findOne({ userName: req.body.user })

        var staffNew = orderTable.staff;
        staffNew[staffNew.length] = {
            id: idstaff(),
            userName: staffTemp.userName,
            name: staffTemp.name,
            position: staffTemp.position,
            act: "Thông báo",
        }
        var result = await order.updateOne({dinnerTable: req.body.table},{
            note: req.body.note,
            staff: staffNew
        })
        if (result) res.json("ok")
        else res.json("error")
    }

    async completeOrder(req,res,next){
        var table = req.query.table
        var user = req.query.user
        var staffTemp = await infoStaff.findOne({ userName: user })
        var orderTable = await order.findOne({ dinnerTable: table })
        var staffNew = orderTable.staff;
        staffNew[staffNew.length] = {
            id: idstaff(),
            userName: staffTemp.userName,
            name: staffTemp.name,
            position: staffTemp.position,
            act: "Hoàn thành món",
        }

        var result = await order.updateOne({ dinnerTable: table }, {
            staff: staffNew,
            state: "Hoàn thành món"
        })
        if(result) res.json("ok")
        else res.json("error")
    }

    async getWarehouse(req,res,next){
        var result = await warehouse.find({})
        res.json(result)
    }

    async getOneWarehouse(req,res,next){
        var result = await warehouse.findOne({slug: req.query.slug})
        res.json(result)
    }
    async changeQuantityWarehouse(req,res,next){
        console.log(req.body)
        res.json(req.body.quantity)
    }

}

module.exports = new ChefController();
