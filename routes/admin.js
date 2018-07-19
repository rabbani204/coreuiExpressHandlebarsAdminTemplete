const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const Group = require('../models/group')
const Conversion = require('../models/conversion')
const Filetype = require('../models/file_type')
const SubGroup = require('../models/subgroup')
const validator = require('validator');


router.get('/error', function(req, res){
	res.render('admin/error', {layout: 'admin-raw'});
});

router.get('/home', function (req, res) {
    res.render('admin/home', { layout: 'admin' });
});

router.get('/conversion', function (req, res) {
    //res.render('admin/conversion/index', {layout: 'admin'});
    var conversion = Conversion.find(function (err, docs) {
        var conversionChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            conversionChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('admin/conversion/index', { layout: 'admin', conversions: conversionChunks });
    });

});

router.get('/conversion/create', function (req, res) {
    var conversion = {};
    res.render('admin/conversion/form', { layout: 'admin', conversion: conversion });
});

router.post('/conversion', function (req, res) {
    const conversion = new Conversion({
        source: req.body.source,
        target: req.body.target,
        extra_params: req.body.extra_params,
        pages: req.body.pages,
        software: req.body.software
    });

    req.checkBody('source', 'Source is required').notEmpty();
    req.checkBody('target', 'Source is required').notEmpty();
    req.checkBody('extra_params', 'Source is required').notEmpty();
    req.checkBody('pages', 'Source is required').notEmpty();
    req.checkBody('software', 'Source is required').notEmpty();
    //errs = conversion.validateSync();
    //conversion.save();
    // if (errs) {
    //     console.log('fa')
    //     res.json({ success: false, msg: 'Failed to insert.' });
    //     res.redirect('error');
    // } else {
    //     console.log('su')
    //     res.redirect('/admin/conversion');
    // }
    //res.render('admin/conversion/form', {layout: 'admin', conversion: conversion});

    var errors = req.validationErrors();
    if(errors){
        console.log('error');
        res.redirect('error');
	} else {
        console.log('success');
        conversion.save();
        res.redirect('/admin/conversion');
    }
        

});

router.get('/conversion/:id/edit', function(req, res){
    var conversion = Conversion.findById(req.params.id).then(conversion => {
        res.render('admin/conversion/form', { layout: 'admin', conversion: conversion });
    });;

});


router.post('/conversion/:id', function(req, res){
    const conversion = {
        source: req.body.source,
        target: req.body.target,
        extra_params: req.body.extra_params,
        pages: req.body.pages,
        software: req.body.software
    };

    Conversion.findByIdAndUpdate(req.params.id, conversion, {new: true}, function(err, model){
        if(err){
            console.log('error');
        } else{
            console.log('success');
            res.redirect('/admin/conversion');
        }

    })
});


router.get('/conversion/:id/delete', function(req, res){
    Conversion.findByIdAndRemove(req.params.id, function(err, model){
        if(err){
            console.log('error');
        } else{
            console.log('success');
            res.redirect('/admin/conversion');
        }

    })
});







router.get('/filetype', function (req, res) {
    //res.render('admin/filetype/index', { layout: 'admin' });
        //res.render('admin/conversion/index', {layout: 'admin'});
        var filetypes = Filetype.where('_id != ""').populate('group').populate('sub_group').find(function (err, docs) {
            var filetypeChunks = [];
            var chunkSize = 3;
            for (var i = 0; i < docs.length; i += chunkSize) {
                filetypeChunks.push(docs.slice(i, i + chunkSize));
            }
            res.render('admin/filetype/index', { layout: 'admin', filetyps: filetypeChunks });
        });
});

router.get('/filetype/create', function (req, res) {
    var groups = Group.find(function (err, groups) {
        res.render('admin/filetype/form', { layout: 'admin', groups: groups });
    });
});


router.post('/filetype', function (req, res) {
    const filetype = new Filetype({
        ext: req.body.ext,
        primery: req.body.primery,
        listed: req.body.listed,
        same_as: req.body.same_as,
        name: req.body.name,
        type: req.body.type,
        group:  req.body.group,
        sub_group:  req.body.subgroup
    });


    req.checkBody('ext', 'Source is required').notEmpty();
    req.checkBody('primery', 'Source is required').notEmpty();
    req.checkBody('listed', 'Source is required').notEmpty();
    req.checkBody('same_as', 'Source is required').notEmpty();
    req.checkBody('name', 'Source is required').notEmpty();
    req.checkBody('type', 'Source is required').notEmpty();
    req.checkBody('group', 'Source is required').notEmpty();
    req.checkBody('subgroup', 'Source is required').notEmpty();


    var errors = req.validationErrors();

    if(errors){
        console.log('error');
        res.redirect('error');
	} else {
        console.log('success');
        filetype.save();
        res.redirect('/admin/filetype');
    }


    // filetype.save()
    // errs = filetype.validateSync();

    // if (errs) {
    //     console.log('fa')
    //     res.redirect('error');
    // } else {
    //     console.log('su')
    //     res.redirect('/admin/filetype');
    // }
    // //res.render('admin/conversion/form', {layout: 'admin', conversion: conversion});

});


router.get('/filetype/:id/edit', function(req, res){
    var filetype = Filetype.findById(req.params.id).then(filetype => {
        var groups = Group.find(function (err, groups) {
            res.render('admin/filetype/form', { layout: 'admin', filetype: filetype, groups: groups });
        });
    });;

});


router.post('/filetype/:id', function(req, res){
    const filetype = {
        ext: req.body.ext,
        primery: req.body.primery,
        listed: req.body.listed,
        same_as: req.body.same_as,
        name: req.body.name,
        type: req.body.type,
        group:  req.body.group,
        sub_group:  req.body.subgroup
    };

    Filetype.findByIdAndUpdate(req.params.id, filetype, {new: true}, function(err, model){
        if(err){
            console.log('error');
        } else{
            console.log('success');
            res.redirect('/admin/filetype');
        }

    })
});


router.get('/filetype/:id/delete', function(req, res){
    Filetype.findByIdAndRemove(req.params.id, function(err, model){
        if(err){
            console.log('error');
        } else{
            console.log('success');
            res.redirect('/admin/filetype');
        }

    })
});





router.get('/images', function (req, res) {
    FileType.find().then(data => {
        res.send({ success: true, data: data });
        // res.render('index');
    });
});


router.put('/images', function (req, res) {
    let newFile = new FileType(req.body.newFile);

    newFile.save().then(err => {
        if (err) {
            res.json({ success: false, msg: 'Failed to insert.' });
        } else {
            res.json({ success: true, msg: 'Successfully Insert.' });
        }
    })
});

router.get('/group', function (req, res) {

    var groups = Group.find(function (err, docs) {
        var groupChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            groupChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('admin/group/index', { layout: 'admin', groups: groupChunks });
    });

});
router.get('/group/create', function (req, res) {
    res.render('admin/group/form', { layout: 'admin' });
});

router.post('/group', function (req, res) {
    const group = new Group({
        name: req.body.name
    });

    req.checkBody('name', 'name is required').notEmpty();


    var errors = req.validationErrors();

    if(errors){
        console.log('error');
        res.redirect('error');
	} else {
        console.log('success');
        group.save();
        res.redirect('/admin/group');
    }
    //res.render('admin/conversion/form', {layout: 'admin', conversion: conversion});

});


router.get('/group/:id/edit', function(req, res){
    var group = Group.findById(req.params.id).then(group => {
        res.render('admin/group/form', { layout: 'admin', group: group });
    });;

});

router.post('/group/:id', function(req, res){
    const group = {
        name: req.body.name
    };

    Group.findByIdAndUpdate(req.params.id, group, {new: true}, function(err, model){
        if(err){
            console.log('error');
        } else{
            console.log('success');
            res.redirect('/admin/group');
        }

    })
});



router.get('/group/:id/delete', function(req, res){
    Group.findByIdAndRemove(req.params.id, function(err, model){
        if(err){
            console.log('error');
        } else{
            console.log('success');
            res.redirect('/admin/group');
        }

    })
});






router.get('/getsubgroups/:id', function (req, res) {
    SubGroup.where({ group: req.params.id }).find((err, subgroups) => {
        res.json(subgroups);
    });
});
router.get('/group/:id', function (req, res) {

    // SubGroup.find((err, docs) => {
    //     res.json(docs);
    // });

    var groups = Group.where({ _id: req.params.id }).findOne(function (err, docs) {
        if (err) return false;

        SubGroup.where({ group: req.params.id }).find((err, subgroups) => {
            // res.json(subgroups);
            res.render('admin/group/details', { layout: 'admin', group: docs, subgroups: subgroups });
        });

    });

});

router.get('/groups', function (req, res) {
    Group.find().then(data => {
        res.send({ success: true, data: data });
    });
});
router.put('/groups', function (req, res) {
    let group = new Group(req.body.group);

    group.save();

    errs = user.validateSync();

    if (errs) {
        res.json({ success: false, msg: 'Failed to insert.' });
    } else {
        res.json({ success: true, msg: 'Successfully Inserted.' });
    }
});
router.delete('/groups/:id', function (req, res) {
    const id = req.params.id;
    if (!validator.isAlphanumeric(id)) {
        res.json({ success: false, msg: 'Invalid ID' });
    }

    Group.remove({ _id: id })
        .then(() => {
            res.json({ success: true, msg: 'Successfully Deleted.' });
        })
        .catch((err) => {
            res.json({ success: false, msg: 'Something went wrong!' });
        });
});
router.get('/subgroups', function (req, res) {
    SubGroup.find().populate("group").then(data => {
        res.send({ success: true, data: data });
    });
});


router.post('/subgroup', function (req, res) {
    const subgroup = new SubGroup({
        name: req.body.name
    });

    req.checkBody('name', 'name is required').notEmpty();


    var errors = req.validationErrors();

    if(errors){
        console.log('error');
        res.redirect('error');
	} else {
        console.log('success');
        subgroup.save();
        res.redirect('/admin/group/sds');
    }
    //res.render('admin/conversion/form', {layout: 'admin', conversion: conversion});

});




router.delete('/subgroup/:id', function (req, res) {
    const id = req.params.id;
    if (!validator.isAlphanumeric(id)) {
        res.json({ success: false, msg: 'Invalid ID' });
    }

    SubGroup.remove({ _id: id })
        .then(() => {
            res.json({ success: true, msg: 'Successfully Deleted.' });
        })
        .catch((err) => {
            res.json({ success: false, msg: 'Something went wrong!' });
        });
});


router.get('/subgroup/:id/edit', function(req, res){
    var subgroup = SubGroup.findById(req.params.id).then(subgroup => {
        var groups = Group.find(function (err, groups) {
            res.render('admin/group/updatesubgroup', { layout: 'admin', subgroup: subgroup});
        });
    });;

});


router.post('/subgroup/:id', function(req, res){
    const subgroup = {
        name: req.body.name
    };

    SubGroup.findByIdAndUpdate(req.params.id, subgroup, {new: true}, function(err, model){
        if(err){
            console.log('error');
        } else{
            console.log('success');
            res.redirect('/admin/group/:req.params.id');
        }

    })
});

router.get('/subgroup/:id/delete', function(req, res){
    SubGroup.findByIdAndRemove(req.params.id, function(err, model){
        if(err){
            console.log('error');
        } else{
            console.log(model);
            res.redirect('/admin/group/:model.group');
        }

    })
});





module.exports = router;